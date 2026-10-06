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
  const textArea = document.createElement('textarea');
  textArea.value = value;
  textArea.setAttribute('readonly', '');
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.select();
  try {
    return document.execCommand('copy');
  } finally {
    textArea.remove();
  }
}
