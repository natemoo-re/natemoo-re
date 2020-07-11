import React from "react";
import Svg from './Svg';
import Text from "./Text";

export interface Props {
    cover: string;
    track: string;
    artist: string;
}

export const None: React.FC = () => {
      return (
        <Svg
          width="350"
          height="200"
        >
            <Text family="mono" size="small">No tunes...</Text>
        </Svg>
      );
}

export const Player: React.FC<Props> = ({ track, artist }) => {
    return (
      <Svg width="500" height="200">
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Text family="mono" weight="bold">
            Now Playing
          </Text>
          <div style={{ display: "flex" }}>
            <Text size="small">
              {track}{' '}
            </Text>
            <Text size="small">
              {artist}
            </Text>
          </div>
        </div>
      </Svg>
    );
};
