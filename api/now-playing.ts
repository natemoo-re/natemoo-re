import { NowRequest, NowResponse } from "@vercel/node";
import { nowPlaying } from "../utils/spotify";
import { renderToString } from 'react-dom/server';
import { Player, None } from '../components/NowPlaying';
import { decode } from 'querystring';


export default async function (req: NowRequest, res: NowResponse) {
  const { item } = await nowPlaying();

  const params = decode(req.url.split('?')[1]) as any;
  
  if (params && typeof params.open !== 'undefined') {
    res.writeHead(302, {
      Location: item.external_urls.spotify
    });
    return res.end();
  }

  res.setHeader("Content-Type", "image/svg+xml");

  if (!item) {
    const text = renderToString(None({}));
    return res.status(200).send(text);
  }

  const track = item.name;
  const { images } = item.album;
  const cover = images[images.length - 1];
  const artist = item.artists.map(({ name }) => name).join(', ');
  const text = renderToString(Player({ cover, artist, track }));

  return res.status(200).send(text);
}
