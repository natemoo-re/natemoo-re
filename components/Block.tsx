import React from 'react';
import { colors } from '../utils/colors';
const size = 32;


const Block = ({ color }: { color: keyof typeof colors }) => {
    return (
      <svg
        fill="none"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="0" y="0" width={size} height={size} fill={colors[color]} />
      </svg>
    );
}

export default Block;
