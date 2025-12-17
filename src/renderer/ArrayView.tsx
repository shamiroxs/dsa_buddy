/**
 * SVG-based array visualization
 * Pure rendering, no business logic
 */

import { motion } from 'framer-motion';

interface ArrayViewProps {
  array: number[];
  highlightedIndices?: number[];
  cellWidth?: number;
  cellHeight?: number;
}

export function ArrayView({
  array,
  highlightedIndices = [],
  cellWidth = 60,
  cellHeight = 60,
}: ArrayViewProps) {
  const spacing = 10;
  const totalWidth = array.length * (cellWidth + spacing) - spacing;
  
  return (
    <svg
      width={totalWidth}
      height={cellHeight + 40}
      className="array-view"
    >
      {array.map((value, index) => {
        const x = index * (cellWidth + spacing);
        const isHighlighted = highlightedIndices.includes(index);
        
        return (
          <g key={index}>
            {/* Cell background */}
            <motion.rect
              x={x}
              y={20}
              width={cellWidth}
              height={cellHeight}
              rx={4}
              fill={isHighlighted ? '#3b82f6' : '#1f2937'}
              stroke={isHighlighted ? '#60a5fa' : '#374151'}
              strokeWidth={2}
              initial={{ scale: 1 }}
              animate={{ scale: isHighlighted ? 1.05 : 1 }}
              transition={{ duration: 0.2 }}
            />
            
            {/* Index label */}
            <text
              x={x + cellWidth / 2}
              y={15}
              textAnchor="middle"
              fill="#9ca3af"
              fontSize="12"
              fontWeight="500"
            >
              {index}
            </text>
            
            {/* Value */}
            <text
              x={x + cellWidth / 2}
              y={20 + cellHeight / 2 + 5}
              textAnchor="middle"
              fill={isHighlighted ? '#ffffff' : '#e5e7eb'}
              fontSize="18"
              fontWeight="600"
            >
              {value}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

