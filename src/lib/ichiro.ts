export const MAX_SUGGESTIONS = 4;
// After a few questions the visitor has earned the secret one.
export const SECRET_UNLOCK_AFTER = 3;

type PromptGraph<Id extends string> = Record<Id, { next: readonly Id[] }>;

type SuggestionInput<Id extends string> = {
  currentId: Id;
  askedIds: readonly Id[];
  graph: PromptGraph<Id>;
  discoveryOrder: readonly Id[];
  secretId: Id;
};

export function nextSuggestions<Id extends string>({
  currentId,
  askedIds,
  graph,
  discoveryOrder,
  secretId,
}: SuggestionInput<Id>): Id[] {
  const asked = new Set(askedIds);
  const unlocked = askedIds.length >= SECRET_UNLOCK_AFTER ? [secretId] : [];
  const candidates = [...graph[currentId].next, ...unlocked, ...discoveryOrder];

  return Array.from(new Set(candidates))
    .filter((id) => !asked.has(id))
    .slice(0, MAX_SUGGESTIONS);
}

// How long each character takes to appear while ichiro "talks", and the cap that keeps long answers
// from dragging on: past it, the text speeds up so any answer finishes in about the same time.
export const MS_PER_CHAR = 22;
export const MAX_TYPING_MS = 2400;

export function typingDuration(text: string): number {
  return Math.min(text.length * MS_PER_CHAR, MAX_TYPING_MS);
}

// Characters visible after `elapsedMs` of typing out `text`.
export function charsShown(text: string, elapsedMs: number): number {
  const duration = typingDuration(text);
  if (duration <= 0 || elapsedMs >= duration) return text.length;
  return Math.floor((Math.max(0, elapsedMs) / duration) * text.length);
}
