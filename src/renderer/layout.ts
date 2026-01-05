// renderer/layout.ts
export function getArrayLayout(
    length: number,
    cellWidth = 60,
    spacing = 10
  ) {
    const totalWidth = length * (cellWidth + spacing);
    return {
      cellWidth,
      spacing,
      totalWidth,
      viewBoxWidth: totalWidth + 4,
    };
  }
  