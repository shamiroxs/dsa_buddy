/**
 * SVG-based array visualization
 * Pure rendering, no business logic
 */

import { motion } from 'framer-motion';

interface ArrayViewProps {
  array: number[];

  /** Pointer positions */
  mocoPointer?: number;
  chocoPointer?: number;

  cellWidth?: number;
  cellHeight?: number;
}

export function ArrayView({
  array,
  mocoPointer,
  chocoPointer,
  cellWidth = 60,
  cellHeight = 60,
}: ArrayViewProps) {
  const spacing = 10;
  const totalWidth = array.length * (cellWidth + spacing) - spacing;

  return (
    <svg
      viewBox={`0 0 ${totalWidth + 4} ${cellHeight + 70}`}
      preserveAspectRatio="xMidYMid meet"
      className="w-full max-w-[360px] h-auto block mx-auto"
    >
      {array.map((value, index) => {
        const x = 2 + index * (cellWidth + spacing);

        const hasMoco = mocoPointer === index;
        const hasChoco = chocoPointer === index;
        const both = hasMoco && hasChoco;

        const fill = both
          ? '#7c3aed' // purple
          : hasMoco
          ? '#2563eb' // blue
          : hasChoco
          ? '#dc2626' // red
          : '#1f2937';

        const stroke = both
          ? '#a78bfa'
          : hasMoco
          ? '#60a5fa'
          : hasChoco
          ? '#f87171'
          : '#374151';

        return (
          <g key={index}>
            {/* Cell background */}
            <motion.rect
              x={x}
              y={30}
              width={cellWidth}
              height={cellHeight}
              rx={6}
              fill={fill}
              stroke={stroke}
              strokeWidth={2}
              initial={{ scale: 1 }}
              animate={{ scale: hasMoco || hasChoco ? 1.05 : 1 }}
              transition={{ duration: 0.2 }}
            />

            {/* Index label */}
            <text
              x={x + cellWidth / 2}
              y={20}
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
              y={30 + cellHeight / 2 + 6}
              textAnchor="middle"
              fill="#ffffff"
              fontSize="18"
              fontWeight="600"
            >
              {value}
            </text>

            {/* Pointer indicators */}
            {hasMoco && (
              <text
                x={x + cellWidth / 2}
                y={cellHeight + 50}
                textAnchor="middle"
                fill="#93c5fd"
                fontSize="11"
                fontWeight="600"
              >
                MOCO
              </text>
            )}

            {hasChoco && (
              <text
                x={x + cellWidth / 2}
                y={cellHeight + (hasMoco ? 62 : 50)}
                textAnchor="middle"
                fill="#fca5a5"
                fontSize="11"
                fontWeight="600"
              >
                CHOCO
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
