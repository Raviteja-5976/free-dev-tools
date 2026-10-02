"use client";

import { useMemo, useState } from "react";
import type { Tool } from "@/lib/catalog";
import { stripMd } from "./InlineMd";
import { ToolCard } from "./ToolCard";

function haystack(t: Tool): string {
  return [t.name, stripMd(t.description), ...t.notes, ...t.children.map((c) => `${c.name} ${stripMd(c.description)}`)]
    .join(" ")
    .toLowerCase();
}

export function CategoryTools({ tools, title }: { tools: Tool[]; title: string }) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"list" | "az">("list");

  const indexed = useMemo(() => tools.map((t) => ({ t, h: haystack(t) })), [tools]);
  const shown = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    let list = terms.length ? indexed.filter(({ h }) => terms.every((term) => h.includes(term))) : indexed;
    if (sort === "az") list = [...list].sort((a, b) => a.t.name.localeCompare(b.t.name));
    return list.map(({ t }) => t);
  }, [indexed, q, sort]);

  return (
    <>
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Filter {title}</span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Filter ${tools.length} entries in ${title}…`}
            className="input-brut h-14 px-4 font-display font-semibold"
            autoComplete="off"
          />
        </label>
        <div className="flex items-center gap-3" role="group" aria-label="Sort order">
          {(
            [
              ["list", "List order"],
              ["az", "A → Z"],
            ] as const
          ).map(([v, label]) => (
            <button
              key={v}
              type="button"
              aria-pressed={sort === v}
              onClick={() => setSort(v)}
              className={`tactile-btn btn-sm ${sort === v ? "btn-ink" : "btn-secondary"}`}
            >
              {label}
            </button>
          ))}
          <span className="chip bg-paper-pure text-ink tabular-nums" aria-live="polite">
            {shown.length}/{tools.length}
          </span>
        </div>
      </div>

      {shown.length === 0 ? (
        <div className="card-brut card-sm bg-paper-sunk p-6">
          <p className="font-display text-xl font-bold">No entries match “{q}”.</p>
          <p className="mt-1 text-sm text-ink/70">Clear the filter or search across every category from the home page.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {shown.map((t) => (
            <ToolCard key={t.id} tool={t} />
          ))}
        </div>
      )}
    </>
  );
}
