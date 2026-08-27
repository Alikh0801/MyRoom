import type { BlogAccent, BlogSection } from "@/lib/blog/types";

const ACCENTS: BlogAccent[] = ["forest", "sunset", "sea", "amber", "dusk"];

/** Slug-dan sabit gradient seçir ki, örtük şəkli olmayan məqalə də eyni görünsün */
export function accentForSlug(slug: string): BlogAccent {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return ACCENTS[hash % ACCENTS.length];
}

/**
 * Admin panelin sadə mətn formatını oxuyur:
 *   - "## Başlıq" yeni bölmə açır
 *   - "- bənd" siyahı elementidir
 *   - qalan sətirlər abzasdır (boş sətir abzasları ayırır)
 * İlk "##"-dən əvvəlki mətn giriş (intro) sayılır.
 */
export function parseBlogBody(body: string | null | undefined): {
  intro: string;
  sections: BlogSection[];
} {
  if (!body?.trim()) return { intro: "", sections: [] };

  const introParagraphs: string[] = [];
  const sections: BlogSection[] = [];
  let current: BlogSection | null = null;
  let paragraph: string[] = [];

  function flushParagraph() {
    const text = paragraph.join(" ").trim();
    paragraph = [];
    if (!text) return;
    if (current) current.paragraphs.push(text);
    else introParagraphs.push(text);
  }

  for (const rawLine of body.replace(/\r\n/g, "\n").split("\n")) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      continue;
    }

    if (line.startsWith("## ")) {
      flushParagraph();
      current = { heading: line.slice(3).trim(), paragraphs: [], list: [] };
      sections.push(current);
      continue;
    }

    if (line.startsWith("- ")) {
      flushParagraph();
      const item = line.slice(2).trim();
      if (!item) continue;
      if (current) current.list.push(item);
      continue;
    }

    paragraph.push(line);
  }

  flushParagraph();

  return { intro: introParagraphs.join("\n\n"), sections };
}

/** "Qısa faktlar" sahəsi — hər sətir ayrı bənd */
export function parseHighlights(value: string | null | undefined): string[] {
  if (!value) return [];
  return value
    .split("\n")
    .map((line) => line.replace(/^[-•]\s*/, "").trim())
    .filter(Boolean);
}
