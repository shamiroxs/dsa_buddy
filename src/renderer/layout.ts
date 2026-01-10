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
  
export function getCellX(
  index: number,
  cellWidth: number,
  spacing: number,
  offset = 2
) {
  return offset + index * (cellWidth + spacing);
}

export function getCellCenterX(
  index: number,
  cellWidth: number,
  spacing: number,
  offset = 2
) {
  return getCellX(index, cellWidth, spacing, offset) + cellWidth / 2;
}
