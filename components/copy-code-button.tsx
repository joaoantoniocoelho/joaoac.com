"use client";

import { useState } from 'react';
import { FiCheck, FiCopy } from 'react-icons/fi';
import { copyToClipboard } from '@/lib/copy-to-clipboard';

export function CopyCodeButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await copyToClipboard(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="focus-ring absolute right-2 top-2 inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-black/60 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-zinc-400 hover:text-white"
      aria-label={copied ? 'Copied' : 'Copy code'}
    >
      {copied ? <FiCheck className="h-3 w-3 text-emerald-300" /> : <FiCopy className="h-3 w-3" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}
