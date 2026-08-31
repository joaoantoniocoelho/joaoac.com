"use client";

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

export type ByteMood = 'idle' | 'thinking' | 'greeting' | 'sleeping';

const assetByMood: Record<Exclude<ByteMood, 'sleeping'>, string> = {
  idle: '/byte/byte-idle.png',
  thinking: '/byte/byte-thinking.png',
  greeting: '/byte/byte-greeting.png',
};

type ByteMascotProps = {
  mood: ByteMood;
  isOpen: boolean;
  compact: boolean;
  onClick: () => void;
  onWake: () => void;
  buttonRef: React.RefObject<HTMLButtonElement>;
};

export function ByteMascot({ mood, isOpen, compact, onClick, onWake, buttonRef }: ByteMascotProps) {
  const [isBlinking, setIsBlinking] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const blinkTimerRef = useRef<number>();
  const blinkEndTimerRef = useRef<number>();

  useEffect(() => {
    [
      '/byte/byte-blink.png',
      '/byte/byte-thinking.png',
      '/byte/byte-greeting.png',
      '/byte/byte-peeking.png',
      '/byte/byte-talking.png',
    ].forEach((source) => {
      const image = new window.Image();
      image.src = source;
    });
  }, []);

  useEffect(() => {
    window.clearTimeout(blinkTimerRef.current);
    window.clearTimeout(blinkEndTimerRef.current);

    if (prefersReducedMotion || mood !== 'idle') {
      setIsBlinking(false);
      return;
    }

    const scheduleBlink = () => {
      blinkTimerRef.current = window.setTimeout(
        () => {
          setIsBlinking(true);
          blinkEndTimerRef.current = window.setTimeout(() => {
            setIsBlinking(false);
            scheduleBlink();
          }, 170);
        },
        2600 + Math.random() * 3200,
      );
    };

    scheduleBlink();

    return () => {
      window.clearTimeout(blinkTimerRef.current);
      window.clearTimeout(blinkEndTimerRef.current);
    };
  }, [mood, prefersReducedMotion]);

  const imageSource = compact
    ? '/byte/byte-peeking.png'
    : isOpen
      ? '/byte/byte-talking.png'
      : mood === 'sleeping' || isBlinking
        ? '/byte/byte-blink.png'
        : assetByMood[mood];

  const motionProps = prefersReducedMotion
    ? { animate: { opacity: 1, y: 0, rotate: 0, scale: 1 }, transition: { duration: 0 } }
    : mood === 'thinking'
      ? {
          animate: { opacity: 1, y: [0, -2, 0], rotate: [-1, 1, -1], scale: 1 },
          transition: { duration: 1.25, repeat: Infinity, ease: 'easeInOut' as const },
        }
      : mood === 'greeting'
        ? {
            animate: { opacity: 1, y: [0, -9, 0], rotate: [0, -2, 0], scale: [1, 1.03, 1] },
            transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
          }
        : mood === 'sleeping'
          ? {
              animate: { opacity: 0.82, y: 4, rotate: 0, scale: 0.96 },
              transition: { duration: 0.5, ease: 'easeOut' as const },
            }
          : {
              animate: { opacity: 1, y: [0, -2, 0], rotate: 0, scale: [1, 1.012, 1] },
              transition: { duration: 3.8, repeat: Infinity, ease: 'easeInOut' as const },
            };

  return (
    <motion.div
      animate={
        prefersReducedMotion
          ? { opacity: 1, x: 0, y: 0, scale: 1 }
          : compact
            ? { opacity: 0.94, x: 0, y: 0, scale: 1 }
            : { opacity: 1, x: 0, y: 0, scale: 1 }
      }
      transition={{ duration: prefersReducedMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={
        compact
          ? 'fixed right-0 top-1/2 -mt-14 h-28 w-28 origin-right sm:-mt-16 sm:h-32 sm:w-32'
          : 'relative h-28 w-28 origin-bottom-right sm:h-36 sm:w-36'
      }
    >
      <motion.button
        ref={buttonRef}
        type="button"
        onClick={onClick}
        onPointerEnter={onWake}
        aria-label={isOpen ? 'Close Byte' : 'Talk to Byte'}
        aria-expanded={isOpen}
        whileHover={prefersReducedMotion ? undefined : compact ? { x: -4, scale: 1.025 } : { y: -3, scale: 1.025 }}
        whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}
        className="focus-ring group relative h-full w-full cursor-pointer rounded-[2rem]"
      >
        {!compact && (
          <motion.span
            aria-hidden="true"
            animate={
              prefersReducedMotion
                ? undefined
                : mood === 'greeting'
                  ? { opacity: [0.2, 0.45, 0.2], scaleX: [1, 0.82, 1] }
                  : { opacity: 0.25, scaleX: 1 }
            }
            transition={{ duration: 0.72 }}
            className="absolute bottom-1 left-1/2 h-2.5 w-16 -translate-x-1/2 rounded-full bg-black blur-sm"
          />
        )}

        <motion.span {...motionProps} className="absolute inset-0 block origin-bottom drop-shadow-[0_12px_18px_rgba(0,0,0,0.7)]">
          <AnimatePresence initial={false} mode="sync">
            <motion.img
              key={imageSource}
              src={imageSource}
              alt=""
              draggable={false}
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.11 }}
              className="absolute inset-0 h-full w-full select-none object-contain"
            />
          </AnimatePresence>
        </motion.span>

        {!isOpen && (
          <motion.span
            aria-hidden="true"
            animate={prefersReducedMotion ? undefined : { opacity: [0.65, 1, 0.65], scale: [1, 1.18, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute right-1 top-5 h-2.5 w-2.5 rounded-full border-2 border-black bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.6)]"
          />
        )}

      </motion.button>
    </motion.div>
  );
}
