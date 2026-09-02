/** Byte mascot sprites — 288px wide WebP (2× display size for h-36 / 144px). */
export const BYTE_IMAGE_WIDTH = 288;
export const BYTE_IMAGE_HEIGHT = 315;

export const byteAssets = {
  idle: '/byte/byte-idle.webp',
  greeting: '/byte/byte-greeting.webp',
  thinking: '/byte/byte-thinking.webp',
  blink: '/byte/byte-blink.webp',
  peeking: '/byte/byte-peeking.webp',
  talking: '/byte/byte-talking.webp',
} as const;

/** Preload on every page — idle is the default mood; greeting follows quickly on home. */
export const bytePreloadAssets = [byteAssets.idle, byteAssets.greeting] as const;
