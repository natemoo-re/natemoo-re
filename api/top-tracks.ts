import { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { Track } from "../components/Track.ts";
import { topTrack } from "../utils/spotify.ts";
import { toBase64 } from "../utils/encoding.ts";

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    const i = url.searchParams.get("i");

    const index = Number.parseInt(i ?? "", 10);
    const item = await topTrack({ index });

    if (!item) {
      return new Response(null, { status: 404 });
    }

    // If `open` is present (any value, including empty), redirect if possible.
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

    const { name: track } = item;
    const { images = [] } = item.album ?? {};
    const cover = images[images.length - 1]?.url;

    let coverImg: string | null = null;
    if (cover) {
      const resp = await fetch(cover);
      const buff = await resp.arrayBuffer();
      coverImg = `data:image/jpeg;base64,${toBase64(buff)}`;
    }

    const artist = (item.artists ?? []).map(({ name }) => name).join(", ");

    const text = renderToStaticMarkup(
      Track({ index, cover: coverImg, artist, track }) as ReactNode,
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
