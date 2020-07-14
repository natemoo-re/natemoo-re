import React from 'react';
import { colors, colorNames } from '../utils/colors';
const size = 32;

const Block = ({ color }: { color: keyof typeof colors }) => {
  console.log(color);
    return (
      <svg
        fill="none"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {color === "RAINBOW" && (
          <style>{`
          #block {
            animation: RAINBOW 15s cubic-bezier(0.470, 0.020, 1.000, 0.570) infinite;
          }

          @keyframes RAINBOW {
            ${colorNames
              .slice(0, -1)
              .map((name, i, { length: total }) => {
                return `${Math.floor((i / (total - 1)) * 100)}% {
                fill: ${colors[name]};
              }`;
              })
              .join("\n")}
        `}</style>
        )}
        <rect
          id="block"
          x="0"
          y="0"
          width={size}
          height={size}
          fill={colors[color === "RAINBOW" ? "red" : color]}
        />
      </svg>
    );
}

export default Block;
