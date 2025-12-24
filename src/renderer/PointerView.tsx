/**
 * SVG-based pointer visualization
 * Shows MOCO (blue) and CHOCO (red) pointers
 * Pure rendering, no business logic
 */

import { motion } from 'framer-motion';

interface PointerViewProps {
  arrayLength: number;

  mocoPointer?: number;
  chocoPointer?: number;

  cellWidth?: number;
  spacing?: number;
}

export function PointerView({
  arrayLength,
  mocoPointer,
  chocoPointer,
  cellWidth = 60,
  spacing = 10,
}: PointerViewProps) {
  const width = arrayLength * (cellWidth + spacing) - spacing ;

  function renderPointer(
    index: number,
    color: string,
    _label: string,
    yOffset: number
  ) {
    if (index < 0 || index >= arrayLength) return null;

    const x = index * (cellWidth + spacing) + cellWidth / 2;

    return (
      <g>
        {/* Arrow */}
        <motion.path
          d={`M ${x} ${yOffset} L ${x - 8} ${yOffset + 20} M ${x} ${yOffset} L ${x + 8} ${yOffset + 20}`}
          stroke={color}
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        />

        {/* Label */}
        <motion.text
          x={x}
          y={yOffset - 6}
          textAnchor="middle"
          fill={color}
          fontSize="11"
          fontWeight="600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {}
        </motion.text>
      </g>
    );
  }

  const sameIndex =
    mocoPointer !== undefined &&
    chocoPointer !== undefined &&
    mocoPointer === chocoPointer;

  return (
    <svg
      viewBox={`0 0 ${width} ${60}`}
      preserveAspectRatio="xMidYMid meet"
      className="pointer-view w-full max-w-[360px] h-auto block mx-auto"
    >
      {/* MOCO pointer */}
      {mocoPointer !== undefined &&
        renderPointer(
          mocoPointer,
          '#3b82f6', // blue
          'MOCO',
          sameIndex ? 0 : 10
        )}

      {/* CHOCO pointer */}
      {chocoPointer !== undefined &&
        renderPointer(
          chocoPointer,
          '#dc2626', // red
          'CHOCO',
          sameIndex ? 26 : 10
        )}
    </svg>
  );
}
