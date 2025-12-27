/**
 * SVG-based pointer visualization
 * Shows MOCO (blue) and CHOCO (red) pointers
 * Pure rendering, no business logic
 */

import { motion } from 'framer-motion';
import type { ExecutionErrorContext } from '../interpreter/vm';

interface PointerViewProps {
  arrayLength: number;

  mocoPointer?: number;
  chocoPointer?: number;

  cellWidth?: number;
  spacing?: number;
  errorContext?: ExecutionErrorContext;
}

export function PointerView({
  arrayLength,
  mocoPointer,
  chocoPointer,
  cellWidth = 60,
  spacing = 10,
  errorContext
}: PointerViewProps) {
  const width = arrayLength * (cellWidth + spacing) - spacing ;

  function renderPointer(
    index: number,
    color: string,
    _label: string,
    yOffset: number,
    isError?: boolean
  ) {
    if (index < 0 || index >= arrayLength) return null;

    const x = index * (cellWidth + spacing) + cellWidth / 2;

    return (
      <g>
        {/* Error ring / pulse */}
        {isError && (
          <motion.path
            d={`M ${x} ${yOffset} L ${x - 8} ${yOffset + 20} M ${x} ${yOffset} L ${x + 8} ${yOffset + 20}`}
            stroke="#ef4444"            // yellow-400
            strokeWidth={6}             // ring thickness
            fill="none"
            strokeLinecap="round"
            initial={{ opacity: 0.4 }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
        {/* Arrow */}
        <motion.path
          d={`M ${x} ${yOffset} L ${x - 8} ${yOffset + 20} M ${x} ${yOffset} L ${x + 8} ${yOffset + 20}`}
          stroke={color}
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
          initial={{ opacity: 0, y: -6 }}
          animate={{
            opacity: 1,
            y: 0,
            x: isError ? [0, -2, 2, -2, 0] : 0, // subtle shake
          }}
          transition={{
            duration: 0.2,
            x: isError ? { duration: 0.3 } : undefined,
          }}
        />
      </g>
    );
  }
  const mocoError =
  errorContext?.kind === 'POINTER' &&
  errorContext.target === 'MOCO';

  const chocoError =
    errorContext?.kind === 'POINTER' &&
    errorContext.target === 'CHOCO';

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
          sameIndex ? 0 : 10,
          mocoError
        )}

      {/* CHOCO pointer */}
      {chocoPointer !== undefined &&
        renderPointer(
          chocoPointer,
          '#dc2626', // red
          'CHOCO',
          sameIndex ? 26 : 10,
          chocoError
        )}
    </svg>
  );
}
