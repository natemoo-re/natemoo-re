import faunadb from "faunadb";
const { query: q } = faunadb;

import { Color } from './colors';

const blocks = [
    '270978642631197184',
    '270978658874688000',
    '270978667450991104',
    '270978703758983680',
    '270978716528542208',
    '270978733565805056',
    '270978748062368256',
    '270978767724216832'
]
const client = new faunadb.Client({ secret: process.env.FAUNADB_KEY });

const blockRef = (index: number) => {
    const blockId = blocks[index];
    return q.Ref(q.Collection('blocks'), blockId);
}

export const getBlockColor = async (index: number): Promise<Color> => {
  const ref = blockRef(index);
  const { data: { color } } = await client.query(q.Get(ref));
  return color;
};

export const setBlockColor = async (index: number, color: string) => {
  const lastModified = new Date().toUTCString();

  const ref = blockRef(index);
  const res = await client.query(
    q.Update(
        ref,
        { data: { color }}
    )
  )
  return res;
};
