export type Dot = { cx: number; cy: number; tone: 0 | 1 | 2 };

// One tone per dot: 0 is the faint grid, 1 the ink, 2 the single yellow accent.
export function moonDots(cols: number, rows: number): Dot[] {
  const dots: Dot[] = [];
  const mid = { x: (cols - 1) / 2, y: (rows - 1) / 2 };
  const radius = Math.min(cols, rows) * 0.34;
  const accent = { x: Math.round(mid.x + radius * 0.55), y: Math.round(mid.y - radius * 0.55) };
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const inside = Math.hypot(x - mid.x, y - mid.y) <= radius;
      const isAccent = x === accent.x && y === accent.y;
      dots.push({ cx: x * 10 + 5, cy: y * 10 + 5, tone: isAccent ? 2 : inside ? 1 : 0 });
    }
  }
  return dots;
}
