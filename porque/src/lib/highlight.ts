export type HighlightParts = { before: string; mark: string; after: string };

// Splits a paragraph around the phrase the edition highlights; a missing phrase leaves it unmarked.
export function splitHighlight(text: string, phrase: string): HighlightParts {
  const at = phrase ? text.indexOf(phrase) : -1;
  if (at === -1) return { before: text, mark: '', after: '' };
  return {
    before: text.slice(0, at),
    mark: phrase,
    after: text.slice(at + phrase.length),
  };
}
