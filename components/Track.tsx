import React from "react";
import ReadmeImg from "./ReadmeImg";
import Text from "./Text";

export interface Props {
  index?: number,
  cover?: string;
  track: string;
  artist: string;
}

export const Track: React.FC<Props> = ({
  index,
  cover,
  track,
  artist,
}) => {
  return (
    <ReadmeImg width="540" height="64">
      <style>
        {`
            @media (prefers-color-scheme: dark) {
              color: #FFF;
            }

            img:not([src]) {
              content: url("data:image/gif;base64,R0lGODlhAQABAPAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==");
              background: #FFF;
              border: 1px solid #e1e4e8;
            }

            img {
              border-radius: 3px;
            }

            p {
              display: block;
            }

            #cover {
              box-shadow: 0 1px 3px rgba(0,0,0,0.1), 0 3px 10px rgba(0,0,0,0.05);
            }

            #cover:not([src]) {
              box-shadow: none;
            }
        `}
      </style>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          paddingTop: 8,
          paddingLeft: 4,
        }}
      >
        <Text style={{ width: '16px', marginRight: '16px' }} size="large" weight="bold">{index}</Text>
        <img id="cover" src={cover ?? null} width="48" height="48" />
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            marginTop: -4,
            marginLeft: 8,
          }}
        >
          <Text id="track" weight="bold">
            {`${track ?? ""} `.trim()}
          </Text>
          <Text id="artist" color={!track ? "gray" : undefined}>
            {artist || "Nothing playing..."}
          </Text>
        </div>
      </div>
    </ReadmeImg>
  );
};
