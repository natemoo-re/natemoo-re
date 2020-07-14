import { NowRequest, NowResponse } from "@vercel/node";
import { renderToString } from "react-dom/server";
import Block from '../../components/Block';
import { getBlockColor, setBlockColor } from "../../utils/db";
import { getNextColor } from '../../utils/colors';
import { createHash } from 'crypto';

export default async function (req: NowRequest, res: NowResponse) {
  const { query: { num }, headers } = req;
  const index = Number.parseInt(num as string) - 1;
  const dest = headers["sec-fetch-dest"] || headers["Sec-Fetch-Dest"];
  const accept = headers['accept'];
  const image = dest ? dest === 'image' : !/text\/html/.test(accept);
  
  const color = await getBlockColor(index);
  if (image) {
    const svg = renderToString(Block({ color }));
    const etag = createHash("md5").update(svg).digest("hex");
    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "no-cache, max-age=0");
    res.setHeader("Etag", etag);
    return res.status(200).send(svg);
  }
  
  const newColor: string = getNextColor(color);
  await setBlockColor(index, newColor);
  return res.status(204).end();
}
