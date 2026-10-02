import fs from "node:fs";
import path from "node:path";

/**
 * Parses content/free-for-dev.md (a verbatim copy of ripienaar/free-for-dev's README)
 * into structured categories at build time. Run `npm run sync` to refresh the copy.
 */

export type Tool = {
  id: string;
  name: string;
  url?: string;
  /** Inline markdown (links, `code`, **bold**). */
  description: string;
  /** Extra bullet notes nested below an entry. */
  notes: string[];
  children: Tool[];
};

export type Category = {
  slug: string;
  title: string;
  index: number;
  tools: Tool[];
  /** Tools + nested sub-entries. */
  count: number;
};

export type SearchEntry = {
  /** name */ n: string;
  /** url */ u?: string;
  /** description (inline md) */ d: string;
  /** category slug */ c: string;
  /** category title */ t: string;
  /** parent tool name, for nested entries */ p?: string;
};

const SOURCE = path.join(process.cwd(), "content", "free-for-dev.md");

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const LEAD_LINK = /^\[([^\]]+)\]\((\S+?)\)\s*(.*)$/;
const SEPARATOR = /^(?:[-–—:]\s*)+/;

function parseEntry(raw: string, id: string): Tool {
  const text = raw.trim();
  const m = text.match(LEAD_LINK);
  if (m) {
    return {
      id,
      name: m[1].trim(),
      url: m[2].trim(),
      description: m[3].replace(SEPARATOR, "").trim(),
      notes: [],
      children: [],
    };
  }
  // "Name - description" without a link (e.g. sub-services of a cloud provider)
  const dash = text.match(/^(.{1,80}?)\s+[-–—]\s+(.*)$/);
  if (dash && !/\]\(/.test(dash[1])) {
    return { id, name: dash[1].trim(), description: dash[2].trim(), notes: [], children: [] };
  }
  return { id, name: text, description: "", notes: [], children: [] };
}

function countTools(tools: Tool[]): number {
  return tools.reduce((n, t) => n + 1 + countTools(t.children), 0);
}

let cache: Category[] | null = null;

export function getCategories(): Category[] {
  if (cache) return cache;
  const md = fs.readFileSync(SOURCE, "utf8");
  const lines = md.split(/\r?\n/);

  const categories: Category[] = [];
  let current: Category | null = null;
  let lastTop: Tool | null = null;
  let lastAny: Tool | null = null;
  const usedSlugs = new Set<string>();

  for (const line of lines) {
    const heading = line.match(/^##\s+(.+?)\s*$/);
    if (heading) {
      const title = heading[1].trim();
      let slug = slugify(title);
      while (usedSlugs.has(slug)) slug += "-x";
      usedSlugs.add(slug);
      current = { slug, title, index: categories.length + 1, tools: [], count: 0 };
      categories.push(current);
      lastTop = lastAny = null;
      continue;
    }
    if (!current) continue;
    if (/^#\s/.test(line)) {
      current = null;
      continue;
    }
    if (!line.trim() || /Back to Top/i.test(line)) continue;

    const bullet = line.match(/^(\s*)[*]\s+(.*)$/);
    const sub = line.match(/^(\s*)[-+]\s+(.*)$/);
    if (bullet) {
      const indent = bullet[1].length;
      if (indent <= 2 || !lastTop) {
        const t = parseEntry(bullet[2], `${current.slug}-${current.tools.length}`);
        current.tools.push(t);
        lastTop = lastAny = t;
      } else {
        const c = parseEntry(bullet[2], `${lastTop.id}-${lastTop.children.length}`);
        lastTop.children.push(c);
        lastAny = c;
      }
    } else if (sub && lastAny) {
      lastAny.notes.push(sub[2].trim());
    } else if (lastAny) {
      // wrapped continuation of the previous entry
      lastAny.description = `${lastAny.description} ${line.trim()}`.trim();
    }
  }

  for (const c of categories) c.count = countTools(c.tools);
  cache = categories.filter((c) => c.tools.length > 0);
  return cache;
}

export function getCategory(slug: string): Category | undefined {
  return getCategories().find((c) => c.slug === slug);
}

export function getStats() {
  const cats = getCategories();
  return {
    categories: cats.length,
    tools: cats.reduce((n, c) => n + c.count, 0),
  };
}

export function getSearchIndex(): SearchEntry[] {
  const out: SearchEntry[] = [];
  for (const c of getCategories()) {
    for (const t of c.tools) {
      out.push({ n: t.name, u: t.url, d: t.description, c: c.slug, t: c.title });
      for (const ch of t.children) {
        out.push({ n: ch.name, u: ch.url, d: ch.description, c: c.slug, t: c.title, p: t.name });
      }
    }
  }
  return out;
}

export function getUpstreamCommit(): string {
  try {
    return fs.readFileSync(path.join(process.cwd(), "content", "UPSTREAM_COMMIT"), "utf8").trim();
  } catch {
    return "";
  }
}

export function hostOf(url?: string): string {
  if (!url) return "";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}
