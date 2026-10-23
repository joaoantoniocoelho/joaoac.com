type ClipboardWriter = { writeText(value: string): Promise<void> };

// The site is served over HTTPS, where the Clipboard API is available in every current browser;
// a denied permission is reported to the caller instead of falling back to the deprecated execCommand.
export async function copyText(
  value: string,
  clipboard: ClipboardWriter | undefined,
): Promise<boolean> {
  if (!clipboard) return false;
  try {
    await clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}
