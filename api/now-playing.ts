import { renderToString } from 'react-dom/server';
import { NowRequest, NowResponse } from "@vercel/node";
import { decode } from 'querystring';
import { nowPlaying } from "../utils/spotify";
import { Player } from '../components/NowPlaying';


export default async function (req: NowRequest, res: NowResponse) {
  const { item = {}, is_playing: isPlaying = false, progress_ms: progress = 0 } = await nowPlaying();

  const params = decode(req.url.split('?')[1]) as any;
  
  if (params && typeof params.open !== 'undefined') {
    if (item && item.external_urls) {
      res.writeHead(302, {
        Location: item.external_urls.spotify,
      });
      return res.end();
    }
    return res.status(200).end();
  }

  res.setHeader("Content-Type", "image/svg+xml");
  // res.setHeader("Cache-Control", "s-maxage=1, stale-while-revalidate");
  res.setHeader("Cache-Control", "no-cache");

  const {
    duration_ms: duration,
    name: track,
  } = item;
  const { images = [] } = item.album || {};

  const cover = images[images.length - 1]?.url;
  let coverImg = null;
  if (cover) {
    const buff = await(await fetch(cover)).arrayBuffer();
    coverImg = `data:image/jpeg;base64,${Buffer.from(buff).toString(
      "base64"
    )}`;
  }

  const artist = (item.artists || []).map(({ name }) => name).join(', ');
  const text = renderToString(
    Player({ cover: coverImg, artist, track, isPlaying, progress, duration })
  );
  return res.status(200).send(text);
}
