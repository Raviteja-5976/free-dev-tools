import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CategoryTools } from "@/components/CategoryTools";
import { UPSTREAM_REPO } from "@/components/Chrome";
import { getCategories, getCategory } from "@/lib/catalog";

export const dynamicParams = false;

export function generateStaticParams() {
  return getCategories().map((c) => ({ slug: c.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = getCategory(slug);
  if (!c) return {};
  return {
    title: `Free ${c.title} tools`,
    description: `${c.count} ${c.title} services with free developer tiers — including ${c.tools
      .slice(0, 5)
      .map((t) => t.name)
      .join(", ")}.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const categories = getCategories();
  const c = getCategory(slug);
  if (!c) notFound();
  const i = categories.findIndex((x) => x.slug === c.slug);
  const prev = categories[i - 1];
  const next = categories[i + 1];

  return (
    <div className="mx-auto max-w-[1320px] px-4 md:px-8">
      <nav aria-label="Breadcrumb" className="pt-8 font-mono text-xs font-bold uppercase tracking-[0.14em] text-ink/60">
        <Link href="/" className="hover:text-ink hover:underline">All tools</Link>
        <span className="mx-2">/</span>
        <Link href="/#categories" className="hover:text-ink hover:underline">Categories</Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{c.title}</span>
      </nav>

      <div className="grid gap-10 pt-8 lg:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="card-brut card-sm sticky top-[100px] max-h-[calc(100vh-124px)] overflow-y-auto p-3">
            <p className="eyebrow px-2 pb-2 pt-1 text-[10px] text-ink/60">All categories</p>
            <ul className="space-y-0.5">
              {categories.map((x) => {
                const current = x.slug === c.slug;
                return (
                  <li key={x.slug}>
                    <Link
                      href={`/category/${x.slug}/`}
                      aria-current={current ? "page" : undefined}
                      className={`flex items-center justify-between gap-2 rounded-xl border-2 px-2.5 py-1.5 text-sm leading-tight ${
                        current
                          ? "border-ink bg-brand font-bold"
                          : "border-transparent hover:border-ink hover:bg-paper-sunk"
                      }`}
                    >
                      <span>{x.title}</span>
                      <span className="font-mono text-[11px] font-bold tabular-nums text-ink/55">{x.count}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        <div className="min-w-0">
          <header className="mb-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="chip bg-paper-sunk text-ink tabular-nums">Shelf {String(c.index).padStart(2, "0")}</span>
              <span className="chip bg-brand text-ink tabular-nums">{c.count} free tiers</span>
            </div>
            <h1 className="mt-4 text-[length:var(--t-display)] font-extrabold leading-[1.05] tracking-[-0.02em] break-words">
              {c.title}
            </h1>
            <p className="mt-4 max-w-2xl text-[length:var(--t-lead)] text-ink/75">
              Services in <strong>{c.title}</strong> that offer an ongoing free tier for developers. Limits change
              often — confirm on the provider&apos;s pricing page before you build on one.
            </p>
            <a
              href={UPSTREAM_REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block font-mono text-xs font-bold uppercase tracking-[0.14em] text-ink/60 underline decoration-2 underline-offset-4 hover:text-ink"
            >
              Spot something outdated? Fix it upstream ↗
            </a>
          </header>

          <CategoryTools tools={c.tools} title={c.title} />

          <nav aria-label="More categories" className="mt-16 grid gap-5 sm:grid-cols-2">
            {prev ? (
              <Link href={`/category/${prev.slug}/`} className="card-brut card-sm card-lift block p-5">
                <span className="eyebrow text-[10px] text-ink/60">← Previous shelf</span>
                <span className="mt-2 block font-display text-lg font-bold">{prev.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link href={`/category/${next.slug}/`} className="card-brut card-sm card-lift block p-5 text-right">
                <span className="eyebrow text-[10px] text-ink/60">Next shelf →</span>
                <span className="mt-2 block font-display text-lg font-bold">{next.title}</span>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
}
