/**
 * SVG-based pointer visualization
 * Shows pointers as arrows pointing to array indices
 */

import { motion } from 'framer-motion';

interface PointerViewProps {
  pointers: Record<string, number>;
  arrayLength: number;
  cellWidth?: number;
  cellHeight?: number;
  spacing?: number;
}

export function PointerView({
  pointers,
  arrayLength,
  cellWidth = 60,
  spacing = 10,
}: PointerViewProps) {
  const pointerColors = [
    '#ef4444', // red
    '#10b981', // green
    '#f59e0b', // orange
    '#8b5cf6', // purple
  ];
  
  const pointerEntries = Object.entries(pointers);
  
  if (pointerEntries.length === 0) {
    return null;
  }
  
  return (
    <svg
      width={arrayLength * (cellWidth + spacing) - spacing}
      height={80}
      className="pointer-view"
    >
      {pointerEntries.map(([pointerId, index], idx) => {
        const x = index * (cellWidth + spacing) + cellWidth / 2;
        const color = pointerColors[idx % pointerColors.length];
        const yOffset = idx * 25;
        
        return (
          <g key={pointerId}>
            {/* Arrow pointing down */}
            <motion.path
              d={`M ${x} ${yOffset} L ${x - 8} ${yOffset + 15} M ${x} ${yOffset} L ${x + 8} ${yOffset + 15}`}
              stroke={color}
              strokeWidth={3}
              fill="none"
              strokeLinecap="round"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            />
            
            {/* Pointer label */}
            <motion.text
              x={x}
              y={yOffset - 5}
              textAnchor="middle"
              fill={color}
              fontSize="12"
              fontWeight="600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {pointerId}
            </motion.text>
          </g>
        );
      })}
    </svg>
  );
}

