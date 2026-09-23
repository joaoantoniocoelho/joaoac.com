import type { CSSProperties } from 'react';

export function FocusTitle({ text }: { text: string }) {
  return <h1 className="hero-title" aria-label={`${text}.`}>
    {text.split(' ').map((word, wordIndex) => <span className="hero-word" key={`${word}-${wordIndex}`} aria-hidden="true">
      {word.split('').map((letter, index) => <span className="hero-letter" key={`${letter}-${index}`} style={{ '--delay': `${0.12 + wordIndex * 0.13 + index * 0.045}s` } as CSSProperties}>{letter}</span>)}
    </span>)}
    <span className="hero-period" aria-hidden="true">.</span>
  </h1>;
}
