# ProTreeTrim Blog Pagination UI Polish v6

Updated files:

- `src/pages/blog/index.astro`
- `src/pages/blog/page/[page].astro`
- `src/pages/blog/category/[slug].astro`

What changed:

- Blog pagination now uses compact page ranges instead of showing every page number.
- First, current-neighbor pages, ellipsis, and last page are shown.
- Mobile view shows a simple `Page X of Y` summary between Prev and Next.
- URL structure is unchanged; existing paginated pages remain accessible.

Note:

- The input ZIP did not include `src/pages/blog/category/[slug]/page/[page].astro`, so this package does not edit category archive pages 2+.
