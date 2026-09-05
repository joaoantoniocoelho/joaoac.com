/** Ichiro mascot sprites — pixel art rendered at up to 315px for crisp high-DPI display. */
export const ICHIRO_IMAGE_WIDTH = 315;
export const ICHIRO_IMAGE_HEIGHT = 315;

export const ichiroAssets = {
  idle: '/ichiro/ichiro-idle.png',
  greeting: '/ichiro/ichiro-greeting.png',
  thinking: '/ichiro/ichiro-thinking.png',
  blink: '/ichiro/ichiro-blink.png',
  peeking: '/ichiro/ichiro-peeking.png',
  talking: '/ichiro/ichiro-talking.png',
  sleeping: '/ichiro/ichiro-sleeping.png',
} as const;

/** Preload on every page — idle is the default mood; greeting follows quickly on home. */
export const ichiroPreloadAssets = [ichiroAssets.idle, ichiroAssets.greeting] as const;
