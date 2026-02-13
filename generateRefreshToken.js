import dotenv from "dotenv";
import { createServer } from "node:http";
import { existsSync } from "node:fs";
import { appendFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import open from "open";

const HOST = "127.0.0.1";
const PORT = 3000;

const cwdUrl = pathToFileURL(`${process.cwd()}/`);
const envFileUrl = new URL(".env", cwdUrl);

if (existsSync(envFileUrl)) {
  console.log("Using .env file to supply config environment variables");
  dotenv.config({ path: envFileUrl });
}

if (process.env.SPOTIFY_REFRESH_TOKEN) {
  console.log(
    "Spotify Refresh Token already set, skipping Generation of Refresh Token."
  );
  process.exit(0);
}

const REQUIRED_CONFIGS = ["SPOTIFY_CLIENT_ID", "SPOTIFY_CLIENT_SECRET"];

/** @type {{ SPOTIFY_CLIENT_ID: string, SPOTIFY_CLIENT_SECRET: string }} */
const configuration = /** @type {any} */ ({});

for (const key of REQUIRED_CONFIGS) {
  const value = process.env[key];
  if (!value) {
    console.error(
      `Missing config ${key}, set as environment variable or add to .env file.`
    );
    process.exit(1);
  }
  configuration[key] = value;
}

/**
 * @typedef {Object} SpotifyTokenResponse
 * @property {string} access_token
 * @property {string} token_type
 * @property {string} scope
 * @property {number} expires_in
 * @property {string=} refresh_token
 */

/**
 * @param {string} authCode
 * @returns {Promise<SpotifyTokenResponse|null>}
 */
async function getSpotifyToken(authCode) {
  const encodedCredentials = Buffer.from(
    `${configuration.SPOTIFY_CLIENT_ID}:${configuration.SPOTIFY_CLIENT_SECRET}`,
    "utf8"
  ).toString("base64");

  const tokenUrl = new URL("https://accounts.spotify.com/api/token");

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code: authCode,
    redirect_uri: `http://${HOST}:${PORT}/callback`,
  });

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${encodedCredentials}`,
    },
    body,
  });

  if (!response.ok) {
    console.error(
      `Error retrieving access token: ${response.status} - ${response.statusText}`
    );
    return null;
  }

  /** @type {SpotifyTokenResponse} */
  const data = await response.json();
  return data;
}

/**
 * @param {string} refreshToken
 * @returns {Promise<void>}
 */
async function writeTokenToEnvFile(refreshToken) {
  const line = `\nSPOTIFY_REFRESH_TOKEN=${refreshToken}`;

  if (existsSync(envFileUrl)) {
    await appendFile(envFileUrl, line, "utf8");
  } else {
    await writeFile(envFileUrl, line, "utf8");
  }

  console.log("Refresh Token added to .env file");
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? "/", `http://${HOST}:${PORT}`);

    if (url.pathname === "/callback") {
      const authCode = url.searchParams.get("code");

      if (!authCode) {
        res.statusCode = 400;
        res.end("Missing ?code=");
        server.close();
        return;
      }

      const tokenResponse = await getSpotifyToken(authCode);

      if (tokenResponse?.refresh_token) {
        await writeTokenToEnvFile(tokenResponse.refresh_token);
      }

      res.statusCode = tokenResponse ? 200 : 502;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(JSON.stringify(tokenResponse, null, 2));

      server.close();
      return;
    }

    res.statusCode = 404;
    res.end();
    server.close();
  } catch (err) {
    res.statusCode = 500;
    res.end(String(err));
    server.close();
  }
});

server.listen(PORT, HOST);

const SCOPES = [
  "user-read-playback-state",
  "user-read-currently-playing",
  "user-top-read",
];

const authorizeUrl = new URL("https://accounts.spotify.com/authorize");
authorizeUrl.search = new URLSearchParams({
  client_id: configuration.SPOTIFY_CLIENT_ID,
  response_type: "code",
  redirect_uri: `http://${HOST}:${PORT}/callback`,
  scope: SCOPES.join(" "),
}).toString();

await open(authorizeUrl.toString());
