import { NowRequest, NowResponse } from "@vercel/node";
import { nowPlaying } from "../utils/spotify";
import { renderToString } from 'react-dom/server';
import { Player, None } from '../components/NowPlaying';


export default async function (req: NowRequest, res: NowResponse) {
  res.setHeader('Content-Type', 'image/svg+xml');

  const { item } = await nowPlaying();

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
