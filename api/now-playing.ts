import { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Player } from "../components/NowPlaying.tsx";
import { nowPlaying } from "../utils/spotify.ts";
import { toBase64 } from "../utils/encoding.ts";

export default {
  async fetch(request: Request): Promise<Response> {
    const {
      item = {} as any,
      is_playing: isPlaying = false,
      progress_ms: progress = 0,
    } = await nowPlaying();

    const url = new URL(request.url);

    // If `open` param is present, attempt redirect
    if (url.searchParams.has("open")) {
      const location = item?.external_urls?.spotify;

      if (location) {
        return new Response(null, {
          status: 302,
          headers: { Location: location },
        });
      }

      return new Response(null, { status: 200 });
    }

    const { duration_ms: duration, name: track } = item ?? {};
    const { images = [] } = item?.album ?? {};

    const cover = images[images.length - 1]?.url;

    let coverImg: string | null = null;
    if (cover) {
      const resp = await fetch(cover);
      const buff = await resp.arrayBuffer();
      coverImg = `data:image/jpeg;base64,${toBase64(buff)}`;
    }

    const artist = (item?.artists || [])
      .map(({ name }: { name: string }) => name)
      .join(", ");

    const text = renderToStaticMarkup(
      Player({
        cover: coverImg,
        artist,
        track,
        isPlaying,
        progress,
        duration,
      }) as ReactNode
    );

    return new Response(text, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "s-maxage=1, stale-while-revalidate",
      },
    });
  },
};
