import { NowRequest, NowResponse } from "@vercel/node";
import { renderToString } from "react-dom/server";
import Block from '../../components/Block';
import { getBlockData, setBlockColor } from "../../utils/db";
import { getNextColor } from '../../utils/colors';

export default async function (req: NowRequest, res: NowResponse) {
  const { query: { num }, headers: { accept } } = req;
  const index = Number.parseInt(num as string) - 1;
  const image = !/text\/html/.test(accept);
  
  const { color, lastModified } = await getBlockData(index);
  if (image) {
    res.setHeader("Content-Type", "image/svg+xml");
    lastModified && res.setHeader("Last-Modified", lastModified);
    return res.status(200).send(renderToString(Block({ color })));
  }
  
  const newColor: string = getNextColor(color);
  await setBlockColor(index, newColor);
  return res.status(204).end();
}
