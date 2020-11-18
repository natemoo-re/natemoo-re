import fetch from "isomorphic-unfetch";
import { stringify } from "querystring";
import { URLSearchParams } from 'url';

const {
  SPOTIFY_CLIENT_ID: client_id,
  SPOTIFY_CLIENT_SECRET: client_secret,
  SPOTIFY_REFRESH_TOKEN: refresh_token,
} = process.env;

const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");
const Authorization = `Basic ${basic}`;
const BASE_URL = `https://api.spotify.com/v1`;

async function getAuthorizationToken() {
  const url = new URL("https://accounts.spotify.com/api/token");
  const body = stringify({
    grant_type: "refresh_token",
    refresh_token,
  });
  const response = await fetch(`${url}`, {
    method: "POST",
    headers: {
      Authorization,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  }).then((r) => r.json());

  return `Bearer ${response.access_token}`;
}

const NOW_PLAYING_ENDPOINT = `/me/player/currently-playing`;
export async function nowPlaying(): Promise<Partial<SpotifyApi.CurrentlyPlayingResponse>> {
  const Authorization = await getAuthorizationToken();
  const response = await fetch(`${BASE_URL}${NOW_PLAYING_ENDPOINT}`, {
    headers: {
      Authorization,
    },
  });
  const { status } = response;
  if (status === 204) {
    return {};
  } else if (status === 200) {
    const data = await response.json();
    return data;
  }
}

const TOP_TRACKS_ENDPOINT = `/me/top/tracks`;
export async function topTrack({ index, timeRange = 'short_term' }: { index: number, timeRange?: 'long_term'|'medium_term'|'short_term' }): Promise<SpotifyApi.TrackObjectFull> {
  const Authorization = await getAuthorizationToken();
  const params = new URLSearchParams();
  params.set('limit', '1');
  params.set('offset', `${index}`);
  params.set('time_range', `${timeRange}`);
  const response = await fetch(`${BASE_URL}${TOP_TRACKS_ENDPOINT}?${params}`, {
    headers: {
      Authorization
    },
  });
  const { status } = response;
  if (status === 204) {
    return null;
  } else if (status === 200) {
    const data = await response.json() as SpotifyApi.UsersTopTracksResponse;
    return data.items[0];
  }
}
