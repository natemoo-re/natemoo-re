import { VercelRequest, VercelResponse } from "@vercel/node";
import { renderToStaticMarkup } from "react-dom/server";
import { Player } from "../components/NowPlaying";
import { nowPlaying } from "../utils/spotify";
import { ReactNode } from "react";

export default async function (req: VercelRequest, res: VercelResponse) {
  const {
    item = ({} as any),
    is_playing: isPlaying = false,
    progress_ms: progress = 0,
  } = await nowPlaying();

  const params = new URL(req.url).searchParams;

  if (params && typeof params.has('open')) {
    if (item && item.external_urls) {
      res.writeHead(302, {
        Location: item.external_urls.spotify,
      });
      return res.end();
    }
    return res.status(200).end();
  }

  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "s-maxage=1, stale-while-revalidate");

  const { duration_ms: duration, name: track } = item;
  const { images = [] } = item.album || {};

  const cover = images[images.length - 1]?.url;
  let coverImg = null;
  if (cover) {
    const buff = await (await fetch(cover)).arrayBuffer();
    coverImg = `data:image/jpeg;base64,${Buffer.from(buff).toString("base64")}`;
  }

  const artist = (item.artists || []).map(({ name }) => name).join(", ");
  const text = renderToStaticMarkup(
    Player({ cover: coverImg, artist, track, isPlaying, progress, duration }) as ReactNode
  );
  return res.status(200).send(text);
}
