import type { Metadata } from "next";
import Link from "next/link";
import { THIS_REPO, UPSTREAM_REPO } from "@/components/Chrome";
import { getStats, getUpstreamCommit } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "About",
  description: "How DevTrackAcademy Free Dev Tools is built, and where the list comes from.",
};

export default function About() {
  const stats = getStats();
  const commit = getUpstreamCommit();
  return (
    <article className="mx-auto max-w-2xl px-4 pt-[var(--sp-block)] md:px-0">
      <p className="eyebrow text-ink/60">About</p>
      <h1 className="mt-4 text-[length:var(--t-display)] font-extrabold leading-[1.05] tracking-[-0.02em]">
        A friendlier shelf for <span className="marker">free-for-dev</span>
      </h1>

      <div className="mt-10 space-y-6 text-[length:var(--t-body)] leading-relaxed text-ink/85">
        <p>
          <strong>Free Dev Tools</strong> is a DevTrackAcademy sub-brand that turns the community-maintained{" "}
          <a className="font-semibold underline decoration-brand decoration-[3px] underline-offset-4" href={UPSTREAM_REPO}>
            ripienaar/free-for-dev
          </a>{" "}
          list into a fast, searchable static site — {stats.tools.toLocaleString("en-US")} services across{" "}
          {stats.categories} categories.
        </p>
        <p>
          All listings, descriptions and limits come from that repository and its 1600+ contributors. This site
          doesn&apos;t edit the entries; it parses the upstream README at build time, splits it into category pages and
          adds full-text search.
        </p>
        <p>
          Free tiers change often. Treat every limit here as a pointer and confirm it on the provider&apos;s own pricing
          page before you depend on it.
        </p>
      </div>

      <div className="card-brut mt-12 p-6">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink/60">Build details</p>
        <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 font-mono text-sm">
          <dt className="text-ink/60">Framework</dt>
          <dd>Next.js static export</dd>
          <dt className="text-ink/60">Design</dt>
          <dd>DevTrackAcademy neo-brutalist system</dd>
          <dt className="text-ink/60">Source list</dt>
          <dd className="break-all">
            free-for-dev{" "}
            {commit && (
              <a className="underline underline-offset-4" href={`${UPSTREAM_REPO}/commit/${commit}`}>
                @{commit.slice(0, 7)}
              </a>
            )}
          </dd>
          <dt className="text-ink/60">Refresh</dt>
          <dd>npm run sync</dd>
        </dl>
      </div>

      <div className="mt-12 flex flex-wrap gap-4">
        <Link href="/#search" className="tactile-btn btn-primary">Search the tools</Link>
        <a href={THIS_REPO} target="_blank" rel="noopener noreferrer" className="tactile-btn btn-secondary">
          View source ↗
        </a>
      </div>
    </article>
  );
}
