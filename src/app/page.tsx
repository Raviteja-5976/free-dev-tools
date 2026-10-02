import Link from "next/link";
import { ToolSearch } from "@/components/ToolSearch";
import { UPSTREAM_REPO } from "@/components/Chrome";
import { getCategories, getStats, getUpstreamCommit } from "@/lib/catalog";

const fmt = (n: number) => n.toLocaleString("en-US");

export default function Home() {
  const categories = getCategories();
  const stats = getStats();
  const commit = getUpstreamCommit();
  const biggest = [...categories].sort((a, b) => b.count - a.count)[0];
  const tilts = ["lg:tilt-neg-1", "lg:tilt-pos-1", "lg:tilt-neg-1", "lg:tilt-pos-2"];

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b-4 border-ink">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "radial-gradient(var(--ink) 1.5px, transparent 1.5px)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="relative mx-auto grid max-w-[1320px] items-center gap-12 px-4 py-[var(--sp-block)] md:px-8 lg:grid-cols-[1.25fr_1fr] lg:py-24">
          <div>
            <span className="chip bg-paper-pure text-ink">
              <span className="h-2 w-2 rounded-full border border-ink bg-brand" /> {fmt(stats.tools)} free tiers · 0 trials
            </span>
            <h1 className="mt-6 text-[length:var(--t-hero)] font-extrabold leading-[0.95] tracking-[-0.03em]">
              Build on
              <br />
              <span className="marker">free</span> tiers.
            </h1>
            <p className="mt-8 max-w-xl text-[length:var(--t-lead)] leading-normal text-ink/80">
              Hosting, databases, CI minutes, email APIs, monitoring, GPUs — every SaaS, PaaS and IaaS service with a
              genuine free developer tier, searchable in one place.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="#search" className="tactile-btn btn-primary text-base">
                Search {fmt(stats.tools)} tools
              </Link>
              <Link href="#categories" className="tactile-btn btn-secondary text-base">
                Browse {stats.categories} categories
              </Link>
            </div>
          </div>

          {/* Terminal card */}
          <div className="section-dark card-brut tilt-pos-1 overflow-hidden rounded-3xl p-0">
            <div className="flex items-center gap-2 border-b-4 border-[#FFF8F0] px-5 py-3">
              <span className="h-3.5 w-3.5 rounded-full border-2 border-[#FFF8F0] bg-coral" />
              <span className="h-3.5 w-3.5 rounded-full border-2 border-[#FFF8F0] bg-yellow" />
              <span className="h-3.5 w-3.5 rounded-full border-2 border-[#FFF8F0] bg-mint" />
              <span className="ml-auto font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#FFF8F0]/60">
                ~/free-dev-tools
              </span>
            </div>
            <pre className="overflow-x-auto px-5 py-6 font-mono text-[13px] leading-7 sm:text-sm">
              <code>
                <span className="text-mint">$</span> dta tools --tier=free{"\n"}
                <span className="text-mint">✓</span> indexed <span className="text-yellow tabular-nums">{fmt(stats.tools)}</span> services{"\n"}
                <span className="text-mint">✓</span> across <span className="text-yellow tabular-nums">{stats.categories}</span> categories{"\n"}
                <span className="text-mint">✓</span> trials filtered: <span className="text-yellow">0 shown</span>{"\n"}
                <span className="text-mint">✓</span> source: free-for-dev
                {commit && <span className="text-[#FFF8F0]/50"> @{commit.slice(0, 7)}</span>}
                {"\n"}
                <span className="text-mint">$</span> <span className="animate-pulse">▍</span>
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* ── Stat tiles ───────────────────────────────────── */}
      <section className="mx-auto max-w-[1320px] px-4 pt-[var(--sp-block)] md:px-8" aria-label="Directory stats">
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {[
            { label: "Services listed", value: fmt(stats.tools) },
            { label: "Categories", value: String(stats.categories) },
            { label: "Biggest shelf", value: String(biggest.count), sub: biggest.title },
            { label: "Price to start", value: "$0" },
          ].map((s, i) => (
            <div key={s.label} className={`card-brut card-sm px-5 py-4 ${i % 2 ? "sm:tilt-pos-1" : "sm:tilt-neg-1"}`}>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink/60">{s.label}</p>
              <p className="mt-1 font-display text-3xl font-extrabold tabular-nums sm:text-4xl">{s.value}</p>
              {s.sub && <p className="mt-1 truncate font-mono text-[11px] font-bold text-ink/55">{s.sub}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* ── Search ───────────────────────────────────────── */}
      <section id="search" className="mx-auto max-w-[1320px] scroll-mt-24 px-4 pt-[var(--sp-section)] md:px-8">
        <p className="eyebrow text-ink/60">01 · Search</p>
        <h2 className="mt-3 text-[length:var(--t-h2)] font-extrabold leading-[1.1] tracking-[-0.015em]">
          Find a free tier in seconds.
        </h2>
        <p className="mt-3 max-w-2xl text-ink/75">
          Searches names, descriptions and categories. Press <kbd className="rounded-md border-2 border-ink bg-paper-pure px-1.5 font-mono text-xs font-bold">/</kbd> anywhere to jump here.
        </p>
        <div className="mt-8">
          <ToolSearch total={stats.tools} categories={categories.map((c) => ({ slug: c.slug, title: c.title }))} />
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────── */}
      <section id="categories" className="mx-auto max-w-[1320px] scroll-mt-24 px-4 pt-[var(--sp-section)] md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-ink/60">02 · Browse</p>
            <h2 className="mt-3 text-[length:var(--t-h2)] font-extrabold leading-[1.1] tracking-[-0.015em]">
              {categories.length} shelves of free stuff.
            </h2>
          </div>
          <span className="chip bg-paper-pure text-ink">In upstream order</span>
        </div>

        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, i) => (
            <li key={c.slug}>
              <Link
                href={`/category/${c.slug}/`}
                className={`card-brut card-sm card-lift group flex h-full flex-col p-5 ${tilts[i] ?? ""}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="chip bg-paper-sunk text-ink tabular-nums">{String(c.index).padStart(2, "0")}</span>
                  <span className="chip bg-brand text-ink tabular-nums">{c.count} tools</span>
                </div>
                <h3 className="mt-4 font-display text-xl font-bold leading-tight">{c.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-ink/65">
                  {c.tools
                    .slice(0, 4)
                    .map((t) => t.name)
                    .join(" · ")}
                  {c.tools.length > 4 ? " …" : ""}
                </p>
                <span className="mt-auto pt-4 font-mono text-xs font-bold uppercase tracking-[0.18em] text-ink/70 group-hover:text-ink">
                  Open shelf →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ── House rules (dark band) ──────────────────────── */}
      <section className="section-dark mt-[var(--sp-section)] border-y-4 border-[#1B1F3B]">
        <div className="mx-auto grid max-w-[1320px] gap-10 px-4 py-[var(--sp-section)] md:px-8 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <p className="eyebrow text-mint">03 · House rules</p>
            <h2 className="mt-3 text-[length:var(--t-h2)] font-extrabold leading-[1.1] tracking-[-0.015em]">
              Free tier, not a free trial.
            </h2>
            <p className="mt-5 max-w-md text-[#FFF8F0]/80">
              The list is curated upstream by the free-for-dev community with an opinionated bar for what counts.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href={UPSTREAM_REPO} target="_blank" rel="noopener noreferrer" className="tactile-btn btn-primary">
                Contribute upstream ↗
              </a>
              <Link href="/about/" className="tactile-btn btn-secondary !bg-[#24294A] !text-[#FFF8F0]">
                About this site
              </Link>
            </div>
          </div>
          <ul className="grid gap-5 sm:grid-cols-2">
            {[
              ["As-a-service only", "Hosted offerings — not self-hosted software you run yourself."],
              ["A real free tier", "Ongoing free usage, not a time-boxed trial that converts to paid."],
              ["At least a year", "If the free tier is time-bucketed, it has to last 12 months or more."],
              ["Security isn't paywalled", "Services that lock TLS behind a paid plan don't make the cut."],
            ].map(([t, d], i) => (
              <li key={t} className="card-brut card-sm p-5">
                <span className="font-mono text-xs font-bold text-mint">0{i + 1}</span>
                <h3 className="mt-2 font-display text-lg font-bold">{t}</h3>
                <p className="mt-1.5 text-sm text-[#FFF8F0]/75">{d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
