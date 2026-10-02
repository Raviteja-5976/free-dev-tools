import type { Tool } from "@/lib/catalog";
import { InlineMd } from "./InlineMd";

function host(url?: string) {
  if (!url) return "";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export function ExternalArrow() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden>
      <path d="M5 11 11 5M6 5h5v5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ToolCard({ tool }: { tool: Tool }) {
  const h = host(tool.url);
  const hasChildren = tool.children.length > 0;
  return (
    <article
      id={tool.id}
      className={`card-brut card-sm card-lift flex flex-col p-5 ${hasChildren ? "md:col-span-2" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-xl font-bold leading-tight break-words">
            {tool.url ? (
              <a href={tool.url} target="_blank" rel="noopener noreferrer" className="hover:underline decoration-4 decoration-brand underline-offset-4">
                {tool.name}
              </a>
            ) : (
              tool.name
            )}
          </h3>
          {h && <p className="mt-1 font-mono text-xs font-bold text-ink/55 break-all">{h}</p>}
        </div>
        {tool.url && (
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit ${tool.name}`}
            className="tactile-btn btn-secondary btn-sm shrink-0"
          >
            Visit <ExternalArrow />
          </a>
        )}
      </div>

      {tool.description && (
        <p className="mt-3 text-[0.95rem] leading-relaxed text-ink/85">
          <InlineMd text={tool.description} />
        </p>
      )}

      {tool.notes.length > 0 && (
        <ul className="mt-3 space-y-1.5 text-sm">
          {tool.notes.map((n, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-[0.45em] h-2 w-2 shrink-0 rounded-full border-2 border-ink bg-brand" />
              <InlineMd text={n} />
            </li>
          ))}
        </ul>
      )}

      {hasChildren && (
        <ul className="mt-4 grid gap-x-6 border-t-[3px] border-dashed border-ink/25 pt-3 md:grid-cols-2">
          {tool.children.map((c) => (
            <li key={c.id} id={c.id} className="border-b-2 border-ink/10 py-2.5 text-sm last:border-0">
              <span className="font-display font-bold">
                {c.url ? (
                  <a href={c.url} target="_blank" rel="noopener noreferrer" className="underline decoration-brand decoration-2 underline-offset-[3px] hover:bg-brand">
                    {c.name}
                  </a>
                ) : (
                  c.name
                )}
              </span>
              {c.description && (
                <>
                  <span className="text-ink/40"> — </span>
                  <InlineMd text={c.description} className="text-ink/80" />
                </>
              )}
              {c.notes.length > 0 && (
                <ul className="mt-1.5 list-disc space-y-1 pl-5 text-ink/80 marker:text-ink/40">
                  {c.notes.map((n, i) => (
                    <li key={i}>
                      <InlineMd text={n} />
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
