import { NowRequest, NowResponse } from "@vercel/node";
import { renderToString } from "react-dom/server";
import { Album } from "../components/Album";
import { topTrackAlbum } from "../utils/spotify";

export default async function (req: NowRequest, res: NowResponse) {
  let { i, open } = req.query;
  i = Array.isArray(i) ? i[0] : i;

  const items = await topTrackAlbum({});

  const albumNames = items.map((item) => item.album.name);

  const artistNames = items.map((item) => (item.artists || []).map(({ name }) => name).join(", "));

  const albumYears = items.map((item) => item.album.release_date.split("-")[0]);

  const albumImages = items.map((item) => item.album.images);

  const albumTrackCounts = {};
  albumNames.forEach(function (x) { albumTrackCounts[x] = (albumTrackCounts[x] || 0) + 1; });
  
  let albumSorts = [];
  for (let name in albumTrackCounts) {
    albumSorts.push([name, albumTrackCounts[name]]);
  }
  albumSorts.sort(function(a, b) {
      return b[1] - a[1];
  });

  const uniqueData1 = [...new Set(albumNames)]; // Remove duplicates from data1

  const albumInfo = uniqueData1.reduce((obj, key) => {
  const index = albumNames.lastIndexOf(key); // Find last index of key in data1
    obj[Object.keys(obj).length + 1] = [key, artistNames[index], albumYears[index], albumImages[index]];
    return obj;
  }, {});

  for (let i = 0; i < albumSorts.length; i++) {
    const albumName = albumSorts[i][0];
  
    for (const key in albumInfo) {
      if (albumInfo.hasOwnProperty(key) && albumInfo[key][0] === albumName) {
        albumSorts[i] = albumInfo[key];
        break;
      }
    }
  }

  console.log(albumSorts)

  const cover = albumSorts[Number.parseInt(i)-1][3][albumSorts[i][3].length - 1]?.url;
  let coverImg = null;
  if (cover) {
    const buff = await (await fetch(cover)).arrayBuffer();
    coverImg = `data:image/jpeg;base64,${Buffer.from(buff).toString("base64")}`;
  }

  const albumName = albumSorts[Number.parseInt(i)-1][0]
  const albumArtist = albumSorts[Number.parseInt(i)-1][1]
  const albumYear = albumSorts[Number.parseInt(i)-1][2]

  const text = renderToString(
    Album({ index: Number.parseInt(i), cover: coverImg, albumName, albumArtist, albumYear })
  );

  if (!items[i]) {
      return res.status(404).end();
  }

  if (typeof open !== "undefined") {
    if (items[i] && items[i].external_urls) {
      res.writeHead(302, {
        Location: items[i].external_urls.spotify,
      });
      return res.end();
    }
    return res.status(200).end();
  }

  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "s-maxage=1, stale-while-revalidate");

  
  return res.status(200).send(text);
}
