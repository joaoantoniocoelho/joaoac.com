export const CHART = {
  width: 1080,
  height: 570,
  axisX: 62,
  topY: 14,
  baseY: 512,
  startX: 90,
  startY: 480,
  endX: 740,
  wantY: 34,
  canY: 170,
} as const;

const CONTROL_X = [CHART.startX + 241, CHART.startX + 483] as const;

// Both curves share these proportions, so they start together and only drift apart as they accelerate.
function controlY(endY: number): readonly [number, number] {
  const rise = CHART.startY - endY;
  return [CHART.startY - rise * 0.04, CHART.startY - rise * 0.3];
}

export function point(x: number, y: number): string {
  return [x, y].join(',');
}

export function curvePath(endY: number): string {
  const [y1, y2] = controlY(endY);
  const start = point(CHART.startX, CHART.startY);
  const controls = `${point(CONTROL_X[0], y1)} ${point(CONTROL_X[1], y2)}`;
  return `M${start}C${controls} ${point(CHART.endX, endY)}`;
}

export function gapAreaPath(): string {
  const [y1, y2] = controlY(CHART.canY);
  const controls = `${point(CONTROL_X[1], y2)} ${point(CONTROL_X[0], y1)}`;
  const back = `C${controls} ${point(CHART.startX, CHART.startY)}`;
  return `${curvePath(CHART.wantY)}V${String(CHART.canY)}${back}Z`;
}
