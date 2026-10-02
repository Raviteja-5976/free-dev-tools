import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-[var(--sp-section)] text-center md:px-8">
      <p className="eyebrow text-ink/60">Error · 404</p>
      <h1 className="mt-4 text-[length:var(--t-display)] font-extrabold leading-[1.05] tracking-[-0.02em]">
        That page isn&apos;t on the <span className="marker">free tier</span>.
      </h1>
      <p className="mx-auto mt-6 max-w-xl text-[length:var(--t-lead)] text-ink/75">
        The link may be stale, or the category was renamed upstream.
      </p>
      <div className="mt-10 flex justify-center gap-4">
        <Link href="/" className="tactile-btn btn-primary">Back to all tools</Link>
        <Link href="/#search" className="tactile-btn btn-secondary">Search instead</Link>
      </div>
    </section>
  );
}
