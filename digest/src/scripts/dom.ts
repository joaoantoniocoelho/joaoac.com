type ElementType<T extends Element> = abstract new (...args: never[]) => T;

// Typed lookups without casts: anything that is missing or of the wrong kind comes back as null.
export function find<T extends Element>(
  root: ParentNode,
  selector: string,
  type: ElementType<T>,
): T | null {
  const element = root.querySelector(selector);
  return element instanceof type ? element : null;
}

export function findAll<T extends Element>(
  root: ParentNode,
  selector: string,
  type: ElementType<T>,
): T[] {
  return Array.from(root.querySelectorAll(selector)).filter(
    (element): element is T => element instanceof type,
  );
}

export function element<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
