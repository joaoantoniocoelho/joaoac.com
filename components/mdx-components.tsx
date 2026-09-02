import type { ReactNode } from 'react';
import type { MDXRemoteProps } from 'next-mdx-remote/rsc';
import { CopyCodeButton } from '@/components/copy-code-button';

function extractText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (!node || typeof node !== 'object') return '';
  if (Array.isArray(node)) return node.map(extractText).join('');
  if ('props' in node && node.props && typeof node.props === 'object' && 'children' in node.props) {
    return extractText(node.props.children as ReactNode);
  }
  return '';
}

export const mdxComponents: NonNullable<MDXRemoteProps['components']> = {
  h2: (props) => (
    <h2 className="mt-12 scroll-mt-28 text-2xl font-semibold tracking-tight text-white md:text-3xl" {...props} />
  ),
  h3: (props) => (
    <h3 className="mt-10 scroll-mt-28 text-xl font-semibold tracking-tight text-white" {...props} />
  ),
  p: (props) => <p className="mt-6 text-base leading-[1.65] text-zinc-300" {...props} />,
  a: (props) => (
    <a className="text-amber-200 underline decoration-amber-200/30 underline-offset-4 transition-colors hover:text-white hover:decoration-white/50" {...props} />
  ),
  ul: (props) => <ul className="mt-6 list-disc space-y-2 pl-5 text-base leading-[1.65] text-zinc-300" {...props} />,
  ol: (props) => <ol className="mt-6 list-decimal space-y-2 pl-5 text-base leading-[1.65] text-zinc-300" {...props} />,
  li: (props) => <li className="pl-1" {...props} />,
  blockquote: (props) => (
    <blockquote className="mt-6 border-l-2 border-amber-300/40 pl-5 text-base leading-[1.65] text-zinc-400" {...props} />
  ),
  hr: () => <hr className="my-10 border-white/10" />,
  strong: (props) => <strong className="font-semibold text-white" {...props} />,
  code: ({ className, children, ...props }) => {
    const isBlock = Boolean(className);
    if (!isBlock) {
      return (
        <code className="rounded bg-white/[0.08] px-1.5 py-0.5 font-mono text-[0.9em] text-amber-100" {...props}>
          {children}
        </code>
      );
    }
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  pre: ({ children, ...props }) => (
    <div className="group relative mt-6">
      <CopyCodeButton code={extractText(children).replace(/\n$/, '')} />
      <pre className="overflow-x-auto rounded-2xl border border-white/10 bg-black/60 p-4 pt-10 font-mono text-sm leading-7 text-zinc-200" {...props}>
        {children}
      </pre>
    </div>
  ),
};
