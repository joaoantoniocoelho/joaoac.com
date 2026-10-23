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
