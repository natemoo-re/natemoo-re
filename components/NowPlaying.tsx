import React from "react";
import Svg from "./Svg";
import Text from "./Text";

export interface Props {
  cover?: string;
  track: string;
  artist: string;
  progress: number;
  duration: number;
  isPlaying: boolean;
}

export const Player: React.FC<Props> = ({
  cover,
  track,
  artist,
  progress,
  duration,
  isPlaying,
}) => {
  return (
    <Svg width="256" height="64">
      <style>
        {`
               .paused { 
                  animation-play-state: paused !important;
               }

               img:not([src]) {
                content: url("data:image/gif;base64,R0lGODlhAQABAPAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==");
                border-radius: 6px;
                background: #FFF;
                border: 1px solid #e1e4e8;
               }

            p {
              display: block;
              opacity: 0;
            }

            .progress-bar {
              position: relative;
              width: 100%;
              height: 4px;
              margin: -1px;
              border: 1px solid #e1e4e8;
              border-radius: 4px;
              overflow: hidden;
              padding: 2px;
              z-index: 0;
            }

            #progress {
              position: absolute;
              top: -1px;
              left: 0;
              width: 100%;
              height: 6px;
              transform-origin: left center;
              background-color: #24292e;
              animation: progress ${duration}ms linear;
              animation-delay: -${progress}ms;
            }
            
            .progress-bar,
            #track,
            #artist,
            #cover {
              opacity: 0;
              animation: appear 300ms ease-out forwards;
            }

            #track {
              animation-delay: 400ms;
            }
            #artist {
              animation-delay: 500ms;
            }
            .progress-bar {
              animation-delay: 550ms;
              margin-top: 4px;
            }

            #cover {
              animation-name: cover-appear;
              animation-delay: 300ms;
            }

            @keyframes cover-appear {
              from {
                opacity: 0;
                transform: scale(0.8);
              }
              to {
                opacity: 1;
                transform: scale(1);
              }
            }

            @keyframes appear {
              from {
                opacity: 0;
                transform: translateX(-8px);
              }
              to {
                opacity: 1;
                transform: translateX(0);
              }
            }

            @keyframes progress {
              from {
                transform: scaleX(0)
              }
              to {
                transform: scaleX(1)
              }
            }
        `}
      </style>
      <div
        className={isPlaying ? "disabled" : ""}
        style={{
          display: "flex",
          alignItems: "center",
          paddingTop: 8,
          paddingLeft: 8,
        }}
      >
        <img id="cover" src={cover ?? null} width="48" height="48" />
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            marginLeft: 8,
            marginTop: -4,
          }}
        >
          <Text id="track" weight="bold">
            {`${track ?? ""} `.trim()}
          </Text>
          <Text id="artist" color={!track ? "gray" : undefined}>
            {artist || "Nothing playing..."}
          </Text>
          {track && (
            <div className="progress-bar">
              <div id="progress" className={!isPlaying ? "paused" : ""} />
            </div>
          )}
        </div>
      </div>
    </Svg>
  );
};
