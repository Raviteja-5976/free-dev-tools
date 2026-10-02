import { Fragment, type ReactNode } from "react";

/**
 * Tiny, safe inline-markdown renderer for list descriptions:
 * [links](url), `code`, **bold**, and bare https:// URLs. No raw HTML is ever injected.
 */
const TOKEN =
  /\[([^\]]+)\]\(([^)\s]+)\)|`([^`]+)`|\*\*([^*]+)\*\*|(https?:\/\/[^\s)<>\]]+[^\s)<>\].,;:!?'"])/g;

function safeHref(href: string): string | null {
  if (/^https?:\/\//i.test(href) || /^mailto:/i.test(href)) return href;
  return null;
}

export function renderInline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const m of text.matchAll(TOKEN)) {
    const i = m.index ?? 0;
    if (i > last) out.push(text.slice(last, i));
    if (m[1] !== undefined) {
      const href = safeHref(m[2]);
      out.push(
        href ? (
          <a key={key++} href={href} target="_blank" rel="noopener noreferrer">
            {renderInline(m[1])}
          </a>
        ) : (
          <Fragment key={key++}>{m[1]}</Fragment>
        ),
      );
    } else if (m[3] !== undefined) {
      out.push(<code key={key++}>{m[3]}</code>);
    } else if (m[4] !== undefined) {
      out.push(<strong key={key++}>{renderInline(m[4])}</strong>);
    } else if (m[5] !== undefined) {
      out.push(
        <a key={key++} href={m[5]} target="_blank" rel="noopener noreferrer">
          {m[5].replace(/^https?:\/\/(www\.)?/, "")}
        </a>,
      );
    }
    last = i + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function InlineMd({ text, className = "" }: { text: string; className?: string }) {
  if (!text) return null;
  return <span className={`md ${className}`}>{renderInline(text)}</span>;
}

/** Plain text (for meta descriptions, search matching). */
export function stripMd(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1");
}
