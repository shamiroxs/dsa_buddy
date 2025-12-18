/**
 * SVG-based pointer visualization
 * Shows single pointer as arrow pointing to array index
 */

import { motion } from 'framer-motion';

interface PointerViewProps {
  pointer: number;
  arrayLength: number;
  cellWidth?: number;
  spacing?: number;
}

export function PointerView({
  pointer,
  arrayLength,
  cellWidth = 60,
  spacing = 10,
}: PointerViewProps) {
  if (pointer < 0 || pointer >= arrayLength) {
    return null;
  }
  
  const x = pointer * (cellWidth + spacing) + cellWidth / 2;
  const color = '#3b82f6'; // blue
  
  return (
    <svg
      width={arrayLength * (cellWidth + spacing) - spacing}
      height={50}
      className="pointer-view"
    >
      <g>
        {/* Arrow pointing down */}
        <motion.path
          d={`M ${x} 0 L ${x - 8} 20 M ${x} 0 L ${x + 8} 20`}
          stroke={color}
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        />
        
        {/* Pointer label */}
        <motion.text
          x={x}
          y={-5}
          textAnchor="middle"
          fill={color}
          fontSize="12"
          fontWeight="600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          pointer
        </motion.text>
      </g>
    </svg>
  );
}
