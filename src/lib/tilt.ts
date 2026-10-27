export const MAX_TILT_X_DEG = 10;
export const MAX_TILT_Y_DEG = 14;

export type Box = { left: number; top: number; width: number; height: number };

export type Tilt = {
  rotateX: number;
  rotateY: number;
  glareX: number;
  glareY: number;
};

export const RESTING_TILT: Tilt = { rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 };

const clamp = (value: number) => Math.min(1, Math.max(0, value));

// The card leans toward the pointer: top edge tips back when the pointer is above the center.
export function tiltFor(clientX: number, clientY: number, box: Box): Tilt {
  if (box.width <= 0 || box.height <= 0) return RESTING_TILT;
  const x = clamp((clientX - box.left) / box.width);
  const y = clamp((clientY - box.top) / box.height);
  return {
    rotateX: (0.5 - y) * MAX_TILT_X_DEG,
    rotateY: (x - 0.5) * MAX_TILT_Y_DEG,
    glareX: x * 100,
    glareY: y * 100,
  };
}

// How far the idle sway leans (the pointer tops out at half of the maximum) and how long one lap takes.
const IDLE_STRENGTH = 0.4;
const IDLE_PERIOD_Y_MS = 7000;
const IDLE_PERIOD_X_MS = 9000;
const IDLE_GLARE_TRAVEL = 30;

// A slow drift around the resting pose, used while nobody is touching the card. The two axes
// run on different periods so the path never settles into a visible loop.
export function idleTilt(timeMs: number): Tilt {
  const y = Math.sin((timeMs / IDLE_PERIOD_Y_MS) * 2 * Math.PI);
  const x = Math.cos((timeMs / IDLE_PERIOD_X_MS) * 2 * Math.PI);
  return {
    rotateX: x * MAX_TILT_X_DEG * IDLE_STRENGTH,
    rotateY: y * MAX_TILT_Y_DEG * IDLE_STRENGTH,
    glareX: 50 + y * IDLE_GLARE_TRAVEL,
    glareY: 50 - x * IDLE_GLARE_TRAVEL,
  };
}
