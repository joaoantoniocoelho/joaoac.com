export type ShareChannel = 'copy' | 'x' | 'linkedin';

// Same ref values used in campaign links, so shared visits land in the existing acquisition buckets;
// a copied link can end up anywhere, so it gets its own generic bucket.
export const shareRefs: Record<ShareChannel, string> = { copy: 'share', x: 'x', linkedin: 'linkedin' };

export function sharedEditionUrl(editionUrl: string, channel: ShareChannel): string {
  const url = new URL(editionUrl);
  url.searchParams.set('ref', shareRefs[channel]);
  return url.toString();
}

export function xShareUrl(text: string, url: string): string {
  return `https://x.com/intent/post?${new URLSearchParams({ text, url })}`;
}

export function linkedInShareUrl(url: string): string {
  return `https://www.linkedin.com/sharing/share-offsite/?${new URLSearchParams({ url })}`;
}
