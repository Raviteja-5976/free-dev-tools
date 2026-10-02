"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { SearchEntry } from "@/lib/catalog";
import { InlineMd, stripMd } from "./InlineMd";
import { ExternalArrow } from "./ToolCard";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";
const PAGE = 48;

type Indexed = SearchEntry & { _n: string; _d: string; _t: string };

function score(e: Indexed, terms: string[]): number {
  let s = 0;
  for (const term of terms) {
    if (e._n === term) s += 100;
    else if (e._n.startsWith(term)) s += 40;
    else if (e._n.includes(term)) s += 25;
    else if (e._t.includes(term)) s += 8;
    else if (e._d.includes(term)) s += 5;
    else return 0; // every term must match somewhere
  }
  return s;
}

export function ToolSearch({ total, categories }: { total: number; categories: { slug: string; title: string }[] }) {
  const [index, setIndex] = useState<Indexed[] | null>(null);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [limit, setLimit] = useState(PAGE);
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const loading = useRef(false);

  const load = useCallback(() => {
    if (loading.current) return;
    loading.current = true;
    fetch(`${BASE}/search-index.json`)
      .then((r) => r.json())
      .then((data: SearchEntry[]) =>
        setIndex(
          data.map((e) => ({
            ...e,
            _n: e.n.toLowerCase(),
            _d: stripMd(e.d).toLowerCase(),
            _t: e.t.toLowerCase(),
          })),
        ),
      )
      .catch(() => {
        loading.current = false;
        setError(true);
      });
  }, []);

  // Restore ?q= from the URL, and bind "/" to focus the search box.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initial = params.get("q") || "";
    const initialCat = params.get("c") || "";
    if (initial || initialCat) {
      setQ(initial);
      setCat(initialCat);
      load();
    }
    const onKey = (ev: KeyboardEvent) => {
      const t = ev.target as HTMLElement;
      if (ev.key === "/" && !["INPUT", "TEXTAREA"].includes(t.tagName) && !t.isContentEditable) {
        ev.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.scrollIntoView({ block: "center" });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [load]);

  // Keep the URL shareable.
  useEffect(() => {
    const url = new URL(window.location.href);
    if (q) url.searchParams.set("q", q);
    else url.searchParams.delete("q");
    if (cat) url.searchParams.set("c", cat);
    else url.searchParams.delete("c");
    window.history.replaceState(null, "", url.toString());
    setLimit(PAGE);
  }, [q, cat]);

  const terms = useMemo(
    () => q.toLowerCase().split(/\s+/).map((t) => t.trim()).filter(Boolean),
    [q],
  );

  const results = useMemo(() => {
    if (!index || (!terms.length && !cat)) return [];
    const pool = cat ? index.filter((e) => e.c === cat) : index;
    if (!terms.length) return pool;
    return pool
      .map((e) => ({ e, s: score(e, terms) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s || a.e.n.localeCompare(b.e.n))
      .map((x) => x.e);
  }, [index, terms, cat]);

  const active = terms.length > 0 || !!cat;

  return (
    <div>
      <div className="card-brut p-4 sm:p-5">
        <div className="flex flex-col gap-3 md:flex-row">
          <label className="relative flex-1">
            <span className="sr-only">Search {total} free developer tools</span>
            <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth={3} aria-hidden>
              <circle cx="10.5" cy="10.5" r="6.5" />
              <path d="m15.5 15.5 5 5" strokeLinecap="round" />
            </svg>
            <input
              ref={inputRef}
              type="search"
              value={q}
              onFocus={load}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Try “postgres”, “email api”, “gpu”, “ci minutes”…"
              className="input-brut h-16 pl-14 pr-14 font-display text-lg font-semibold"
              autoComplete="off"
              spellCheck={false}
            />
            <kbd className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-md border-2 border-ink bg-paper-pure px-2 font-mono text-xs font-bold sm:block">
              /
            </kbd>
          </label>
          <label className="relative md:w-72">
            <span className="sr-only">Filter by category</span>
            <select
              value={cat}
              onFocus={load}
              onChange={(e) => {
                setCat(e.target.value);
                load();
              }}
              className="input-brut h-16 appearance-none pl-4 pr-10 font-mono text-sm font-bold uppercase tracking-wider"
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.title}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-bold" aria-hidden>
              ▾
            </span>
          </label>
        </div>
      </div>

      <div aria-live="polite" className="mt-6">
        {active && !index && !error && (
          <p className="font-mono text-sm font-bold uppercase tracking-widest text-ink/60">Loading index…</p>
        )}
        {error && (
          <p className="chip bg-coral text-ink">Couldn&apos;t load the search index — try refreshing.</p>
        )}
        {active && index && (
          <>
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="chip bg-ink text-paper tabular-nums">
                {results.length} {results.length === 1 ? "match" : "matches"}
              </span>
              {(q || cat) && (
                <button
                  type="button"
                  onClick={() => {
                    setQ("");
                    setCat("");
                    inputRef.current?.focus();
                  }}
                  className="tactile-btn btn-secondary btn-sm"
                >
                  Clear
                </button>
              )}
            </div>
            {results.length === 0 ? (
              <div className="card-brut card-sm bg-paper-sunk p-6">
                <p className="font-display text-xl font-bold">Nothing matched “{q}”.</p>
                <p className="mt-1 text-sm text-ink/70">Try a broader word, or browse the categories below.</p>
              </div>
            ) : (
              <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {results.slice(0, limit).map((e, i) => (
                  <li key={`${e.c}-${e.p ?? ""}-${e.n}-${i}`} className="pop-in" style={{ animationDelay: `${Math.min(i, 12) * 20}ms` }}>
                    <article className="card-brut card-sm card-lift flex h-full flex-col p-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link href={`/category/${e.c}/`} className="chip bg-paper-sunk text-ink hover:bg-brand">
                          {e.t}
                        </Link>
                        {e.p && <span className="chip bg-paper-pure text-ink/70">via {e.p}</span>}
                      </div>
                      <h3 className="mt-3 font-display text-lg font-bold leading-tight break-words">
                        {e.u ? (
                          <a href={e.u} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:underline decoration-4 decoration-brand underline-offset-4">
                            {e.n} <ExternalArrow />
                          </a>
                        ) : (
                          e.n
                        )}
                      </h3>
                      {e.d && (
                        <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-ink/80">
                          <InlineMd text={e.d} />
                        </p>
                      )}
                    </article>
                  </li>
                ))}
              </ul>
            )}
            {results.length > limit && (
              <div className="mt-8 flex justify-center">
                <button type="button" onClick={() => setLimit((l) => l + PAGE)} className="tactile-btn btn-primary">
                  Show more <span className="font-mono tabular-nums">({results.length - limit} left)</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
