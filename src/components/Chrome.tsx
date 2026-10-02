import Image from "next/image";
import Link from "next/link";
import logo from "@/app/logo.png";

export const UPSTREAM_REPO = "https://github.com/ripienaar/free-for-dev";
export const THIS_REPO = "https://github.com/Raviteja-5976/free-dev-tools";

export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 sm:gap-2.5">
      <Image src={logo} alt="" width={44} height={36} priority className="h-7 w-auto sm:h-9" />
      <span
        className={`font-display font-extrabold tracking-tight text-ink ${compact ? "text-[15px] sm:text-lg" : "text-lg"}`}
      >
        DevTrack<span className="text-orange">Academy</span>
      </span>
      <span className="chip bg-brand text-ink !px-2 !text-[9px] sm:!px-[0.65rem] sm:!text-[0.6875rem]">Free Tools</span>
    </span>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b-4 border-ink bg-paper">
      <div className="mx-auto flex h-[76px] max-w-[1320px] items-center justify-between gap-3 px-4 md:px-8">
        <Link href="/" aria-label="DevTrackAcademy Free Dev Tools — home" className="rounded-xl">
          <Wordmark compact />
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/#categories"
            className="hidden rounded-xl px-3 py-2 font-display text-sm font-bold hover:bg-paper-sunk md:inline-block"
          >
            Categories
          </Link>
          <Link
            href="/about/"
            className="hidden rounded-xl px-3 py-2 font-display text-sm font-bold hover:bg-paper-sunk md:inline-block"
          >
            About
          </Link>
          <a
            href={THIS_REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-xl px-3 py-2 font-display text-sm font-bold hover:bg-paper-sunk sm:inline-block"
          >
            GitHub ↗
          </a>
          <Link href="/#search" aria-label="Search tools" className="tactile-btn btn-primary btn-sm !px-2.5 sm:!px-[0.8rem]">
            <SearchIcon /> <span className="max-[400px]:hidden">Search</span><span className="hidden sm:inline"> tools</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SearchIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={3} aria-hidden>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 5 5" strokeLinecap="round" />
    </svg>
  );
}

export function SiteFooter({ commit }: { commit: string }) {
  return (
    <footer className="section-dark mt-[var(--sp-section)] border-t-4 border-[#1B1F3B]">
      <div className="mx-auto grid max-w-[1320px] gap-10 px-4 py-14 md:grid-cols-[1.3fr_1fr_1fr] md:px-8">
        <div>
          <div className="inline-flex items-center gap-2.5">
            <Image src={logo} alt="" width={44} height={36} className="h-9 w-auto" />
            <span className="font-display text-lg font-extrabold">
              DevTrack<span className="text-orange">Academy</span>
            </span>
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-[#FFF8F0]/80">
            Free Dev Tools is a searchable, categorised edition of the community-maintained{" "}
            <a className="font-semibold underline decoration-2 underline-offset-4 decoration-mint" href={UPSTREAM_REPO}>
              free-for-dev
            </a>{" "}
            list — services with genuine free tiers for developers, DevOps and infra folks.
          </p>
        </div>
        <div>
          <p className="eyebrow text-mint">Credits</p>
          <ul className="mt-4 space-y-2 text-sm text-[#FFF8F0]/85">
            <li>
              List content ©{" "}
              <a className="underline decoration-2 underline-offset-4" href={UPSTREAM_REPO}>
                ripienaar/free-for-dev
              </a>{" "}
              and its 1600+ contributors
            </li>
            <li>
              Suggest a service upstream via a{" "}
              <a className="underline decoration-2 underline-offset-4" href={`${UPSTREAM_REPO}/pulls`}>
                pull request
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="eyebrow text-mint">Build</p>
          <ul className="mt-4 space-y-2 font-mono text-xs text-[#FFF8F0]/80">
            <li>static · next.js export</li>
            {commit && (
              <li>
                upstream @{" "}
                <a className="underline underline-offset-4" href={`${UPSTREAM_REPO}/commit/${commit}`}>
                  {commit.slice(0, 7)}
                </a>
              </li>
            )}
            <li>
              <a className="underline underline-offset-4" href={THIS_REPO}>
                source on github ↗
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t-2 border-[#FFF8F0]/15">
        <p className="mx-auto max-w-[1320px] px-4 py-5 font-mono text-[11px] uppercase tracking-[0.18em] text-[#FFF8F0]/60 md:px-8">
          DevTrackAcademy · Free Dev Tools · Free tiers change — always check the provider&apos;s pricing page
        </p>
      </div>
    </footer>
  );
}
