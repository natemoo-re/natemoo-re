import { NowRequest, NowResponse } from "@vercel/node";
import { renderToString } from "react-dom/server";
import { Track } from "../components/Track";
import { topTrack } from "../utils/spotify";

export default async function (req: NowRequest, res: NowResponse) {
  let { i, open } = req.query;
  i = Array.isArray(i) ? i[0] : i;
  const item = await topTrack({ index: Number.parseInt(i) });
  
  if (!item) {
      return res.status(404).end();
  }

  if (typeof open !== "undefined") {
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

  const { name: track } = item;
  const { images = [] } = item.album || {};

  const cover = images[images.length - 1]?.url;
  let coverImg = null;
  if (cover) {
    const buff = await (await fetch(cover)).arrayBuffer();
    coverImg = `data:image/jpeg;base64,${Buffer.from(buff).toString("base64")}`;
  }

  const artist = (item.artists || []).map(({ name }) => name).join(", ");
  const text = renderToString(
    Track({ index: Number.parseInt(i), cover: coverImg, artist, track })
  );
  return res.status(200).send(text);
}
