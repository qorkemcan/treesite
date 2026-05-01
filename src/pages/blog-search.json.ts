import { getCollection } from "astro:content";

export const prerender = true;

const normalizeCategory = (value: string) => {
  const clean = value.trim().replace(/\s+/g, " ");

  const aliases: Record<string, string> = {
    "emergency storm": "Emergency & Storm",
    "emergency & storm": "Emergency & Storm",
    "florida laws & property risk": "Florida Laws & Property Risk",
    "tree care & cleanup": "Tree Care & Cleanup",
    "tree health & disease": "Tree Health & Disease",
    "landscaping & planting": "Landscaping & Planting",
    "local florida guides": "Local Florida Guides",
    "tree removal": "Tree Removal",
  };

  return aliases[clean.toLowerCase()] ?? clean;
};

const slugifyCategory = (value: string) =>
  normalizeCategory(value)
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

export async function GET() {
  const allPosts = (await getCollection("blog", ({ data }) => !data.draft)).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );

  const searchIndex = allPosts.map((post) => ({
    title: post.data.title,
    description: post.data.description,
    url: `/blog/${post.slug}/`,
    category: normalizeCategory(post.data.category),
    categoryUrl: `/blog/category/${slugifyCategory(post.data.category)}/`,
    date: post.data.pubDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    haystack:
      `${post.data.title} ${post.data.description} ${normalizeCategory(post.data.category)} ${(post.data.tags ?? []).join(" ")}`.toLowerCase(),
  }));

  return new Response(JSON.stringify(searchIndex), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}