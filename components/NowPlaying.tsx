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
        <Svg width="418" height="226">
          <Text family="mono" size="small">
            No tunes...
          </Text>
        </Svg>
      );
}

export const Player: React.FC<Props> = ({ track, artist }) => {
    return (
      <Svg width="418" height="226">
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Text>
            Now Playing
          </Text>
          <div style={{ marginTop: 8, display: "flex" }}>
            <Text size="small" weight="bold">{track}</Text>
            <Text size="small">{artist}</Text>
          </div>
        </div>
      </Svg>
    );
};
