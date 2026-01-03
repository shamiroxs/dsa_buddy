/**
 * SVG-based pointer visualization
 * Shows MOCO (blue) and CHOCO (red) pointers
 * Pure rendering, no business logic
 */

import type { ExecutionErrorContext } from '../interpreter/vm';
import { Character } from './Character';

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

  function renderCharacter(
    index: number,
    type: 'MOCO' | 'CHOCO',
    yOffset: number,
    isError?: boolean
  ) {
    if (index < 0 || index >= arrayLength) return null;
  
    const x = index * (cellWidth + spacing-0.4) + cellWidth / 2;
  
    return (
      <Character
        type={type}
        x={x}
        y={yOffset}
        size={1.4}
        isError={isError}
      />
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
      viewBox={`0 -2 ${width} ${82}`}
      preserveAspectRatio="xMidYMid meet"
      className="pointer-view w-full max-w-[360px] h-auto block mx-auto"
    >
      {/* MOCO */}
      {mocoPointer !== undefined &&
        renderCharacter(
          mocoPointer,
          'MOCO',
          sameIndex ? 0 : 10,
          mocoError
        )}

      {/* CHOCO */}
      {chocoPointer !== undefined &&
        renderCharacter(
          chocoPointer,
          'CHOCO',
          sameIndex ? 26 : 10,
          chocoError
        )}

    </svg>
  );
}
