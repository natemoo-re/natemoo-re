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
        <Svg width="418" height="24">
          <div style={{ display: "flex" }}>
            <Text>No tunes...</Text>
          </div>
        </Svg>
      );
}

export const Player: React.FC<Props> = ({ track, artist }) => {
    return (
      <Svg width="418" height="24">
        <div style={{ display: "flex" }}>
          <Text weight="bold">{track}{' '}</Text>
          <Text>{artist}</Text>
        </div>
      </Svg>
    );
};
