<img src="public/logo.png" alt="DevTrackAcademy logo" width="96" />

# DevTrackAcademy — Free Dev Tools

A searchable, categorised directory of SaaS / PaaS / IaaS services with **genuine free developer tiers**, built as a static Next.js site in the DevTrackAcademy neo-brutalist design system.

The list itself comes from the community-maintained **[ripienaar/free-for-dev](https://github.com/ripienaar/free-for-dev)** ([free-for.dev](https://free-for.dev)) and its 1600+ contributors. All entries, descriptions and limits are theirs — to add or fix a service, open a pull request **upstream**.

## What's in here

| Path | What it is |
| --- | --- |
| `content/free-for-dev.md` | Verbatim copy of the upstream README (the data source) |
| `content/UPSTREAM_COMMIT` | Upstream commit the copy was taken from |
| `src/lib/catalog.ts` | Build-time parser: markdown → categories, tools, nested sub-services |
| `src/app/page.tsx` | Home — hero, stats, full-text search, category grid |
| `src/app/category/[slug]/` | One statically generated page per category, with in-page filter |
| `src/app/search-index.json/` | Static JSON search index, lazy-loaded on first search |
| `src/app/globals.css` | Design tokens and components from `design.md` |
| `design.md` | DevTrackAcademy master design system |

## Sub-brand

Per `design.md` §3.2, this is a new sub-brand: header wordmark **DevTrackAcademy** + **FREE TOOLS** pill, with `--brand` set to **Positive Mint `#6EE7B7`** ("free = go"). Mint is a light fill, so text on brand fills uses `--ink` instead of white to keep AA contrast. Everything else — `--ink` borders, `--paper` background, hard zero-blur shadows, tactile button physics, Space Grotesk / Inter / JetBrains Mono — follows the master spec.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export → ./out
npm run sync       # pull the latest free-for-dev README
```

Fonts are self-hosted via `@fontsource-variable/*`, so builds need no network access beyond npm.

## Deploy

`output: "export"` produces plain static files in `out/` — host them anywhere (GitHub Pages, Cloudflare Pages, Netlify, S3…).

- **GitHub Pages:** enable *Settings → Pages → Source: GitHub Actions*. `.github/workflows/deploy.yml` builds and publishes on every push to `main`, setting `BASE_PATH` automatically for project pages (`/free-dev-tools`).
- **Custom domain / sub-domain** (e.g. `tools.devtrackacademy.com`): build with no `BASE_PATH`.
- `.github/workflows/sync-upstream.yml` re-syncs the list every Monday and redeploys if it changed.

## Credits

- List content: [ripienaar/free-for-dev](https://github.com/ripienaar/free-for-dev) contributors.
- Design system & logo: DevTrackAcademy.
