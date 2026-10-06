'use client';

import { useEffect, useRef, useState } from 'react';
import { FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';
import { FiCheck, FiLink } from 'react-icons/fi';
import { copyText, copyWithSelection } from '../lib/clipboard';
import { copy, type Locale } from '../lib/copy';
import { linkedInShareUrl, sharedEditionUrl, xShareUrl } from '../lib/share';

type CopyState = 'idle' | 'copied' | 'failed';

type Props = {
  locale: Locale;
  editionUrl: string;
  day: string;
};

const copiedFeedbackMs = 2000;

export function ShareDigest({ locale, editionUrl, day }: Props) {
  const t = copy[locale];
  const [copyState, setCopyState] = useState<CopyState>('idle');
  const resetTimer = useRef<number | undefined>(undefined);
  const copyUrl = sharedEditionUrl(editionUrl, 'copy');
  const shareText = t.sharePost(day);

  useEffect(() => () => window.clearTimeout(resetTimer.current), []);

  async function copyLink() {
    window.clearTimeout(resetTimer.current);
    const copied = await copyText(copyUrl, navigator.clipboard, copyWithSelection);
    setCopyState(copied ? 'copied' : 'failed');
    if (copied) resetTimer.current = window.setTimeout(() => setCopyState('idle'), copiedFeedbackMs);
  }

  const message = copyState === 'copied' ? t.linkCopied : copyState === 'failed' ? t.copyFailed : '';

  return <section className="public-digest-share" aria-labelledby="edition-share-title">
    <h2 id="edition-share-title">{t.shareTitle}</h2>
    <p>{t.shareText}</p>
    <div className="share-actions">
      <button className="share-button" type="button" onClick={copyLink}>
        {copyState === 'copied' ? <FiCheck aria-hidden="true" /> : <FiLink aria-hidden="true" />}
        {copyState === 'copied' ? t.linkCopied : t.copyLink}
      </button>
      <a className="share-button" href={xShareUrl(shareText, sharedEditionUrl(editionUrl, 'x'))} target="_blank" rel="noopener noreferrer" aria-label={`${t.shareOnX} ${t.opensInNewTab}`}>
        <FaXTwitter aria-hidden="true" />X
      </a>
      <a className="share-button" href={linkedInShareUrl(sharedEditionUrl(editionUrl, 'linkedin'))} target="_blank" rel="noopener noreferrer" aria-label={`${t.shareOnLinkedIn} ${t.opensInNewTab}`}>
        <FaLinkedinIn aria-hidden="true" />LinkedIn
      </a>
    </div>
    <p className="message" data-kind={copyState === 'failed' ? 'error' : 'success'} role="status" aria-live="polite">{message}</p>
    {copyState === 'failed' && <input className="email-input share-url" type="text" readOnly value={copyUrl} aria-label={t.shareLink} onFocus={event => event.currentTarget.select()} />}
  </section>;
}
