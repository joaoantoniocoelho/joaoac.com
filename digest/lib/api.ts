export const apiBaseUrl = process.env.NEXT_PUBLIC_DIGEST_API_URL?.replace(/\/+$/, '');

export function unsubscribePath(token: string): string {
  return `${apiBaseUrl}/unsubscribe/${encodeURIComponent(token)}`;
}

export const validToken = /^[A-Za-z0-9_-]{20,128}$/;
