type ClipboardWriter = { writeText(value: string): Promise<void> };

// Clipboard API first; the selection-based fallback covers insecure contexts and browsers that deny the permission.
export async function copyText(value: string, clipboard: ClipboardWriter | undefined, fallback: (value: string) => boolean): Promise<boolean> {
  if (clipboard) {
    try {
      await clipboard.writeText(value);
      return true;
    } catch {}
  }
  try {
    return fallback(value);
  } catch {
    return false;
  }
}

export function copyWithSelection(value: string): boolean {
  // Selecting moves focus to the textarea; restore it so keyboard and screen reader users keep their place.
  const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const textArea = document.createElement('textarea');
  textArea.value = value;
  textArea.setAttribute('readonly', '');
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  // 16px avoids the iOS zoom on focus; setSelectionRange is needed because select() is a no-op on iOS.
  textArea.style.fontSize = '16px';
  document.body.appendChild(textArea);
  textArea.select();
  textArea.setSelectionRange(0, value.length);
  try {
    return document.execCommand('copy');
  } finally {
    textArea.remove();
    previousFocus?.focus();
  }
}
