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
