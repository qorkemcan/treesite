# V14 — Partnerships, Advertising & Growth Opportunities

This package adds a new B2B-facing ProTreeTrim™ opportunity page and keeps it separate from the homeowner quote funnel and the contractor network enrollment funnel.

## What it adds

- New page: `src/pages/partnerships.astro`
  - URL: `/partnerships/`
  - Sections for:
    - Tree Service Partner Network
    - City or Territory Sponsorship Opportunities
    - Advertising & Sponsorship
    - Content & Resource Collaborations
    - Similar Local Growth Asset inquiries
- New dedicated form endpoint: `src/pages/api/partnerships.js`
  - Uses the existing Resend environment variables already used by the contact form.
  - No new environment variables are required.
- New noindex thank-you page: `src/pages/partnership-thank-you.astro`
  - URL: `/partnership-thank-you/`
- Updates `src/pages/contact.astro`
  - Adds a Partnerships CTA block above the existing service request content.
- Updates `src/pages/join-network.astro`
  - Adds a broader commercial inquiry CTA linking to Partnerships.
- Updates `src/layouts/MainLayout.astro`
  - Adds `Partnerships` to the footer links only.
  - Main navigation remains unchanged.
- Updates `generate-sitemaps.mjs`
  - Adds `/partnerships/` to the generated main sitemap.

## Form fields

The Partnerships inquiry form includes:

- Name — required
- Company — required
- Email — required
- Phone — optional
- Website — optional
- Inquiry type — required
- Message — required

Inquiry type options:

1. Tree Service Partner Network
2. City or Territory Sponsorship
3. Advertising or Brand Sponsorship
4. Content or Resource Collaboration
5. Similar Local Growth Asset Inquiry
6. Other Partnership Opportunity

## Install

From the repo root:

```bash
cp ~/Desktop/protreetrim-v14-partnerships-opportunities.zip .

rm -rf _v14_preview
mkdir _v14_preview
unzip -o protreetrim-v14-partnerships-opportunities.zip -d _v14_preview

node _v14_preview/protreetrim-v14-partnerships-opportunities/scripts/install-v14-partnerships-opportunities.mjs

npm run build
```

## Local test

```bash
npm run dev
```

Open and review:

```txt
http://localhost:4321/partnerships/
http://localhost:4321/partnership-thank-you/
http://localhost:4321/contact/
http://localhost:4321/join-network/
```

Check:

- Footer includes `Partnerships`, but the main navigation does not.
- Contact page includes the new Partnerships CTA block.
- Join Network page includes the broader commercial inquiry CTA block.
- `/partnerships/` form posts to `/api/partnerships`.
- `/partnership-thank-you/` is rendered with `noindex,follow`.
- A build regenerates `public/sitemap-main.xml` with `/partnerships/`.

## Optional live form test

With Resend environment variables configured, submit a realistic test inquiry from `/partnerships/` and verify:

- Email lands in the configured `RESEND_TO_EMAIL` inbox.
- Subject begins with `New Partnership Inquiry:`.
- Successful submission redirects to `/partnership-thank-you/`.

## Commit

If build and preview look good:

```bash
git restore public/sitemap*.xml

git add src/pages/partnerships.astro \
  src/pages/partnership-thank-you.astro \
  src/pages/api/partnerships.js \
  src/pages/contact.astro \
  src/pages/join-network.astro \
  src/layouts/MainLayout.astro \
  generate-sitemaps.mjs \
  _INSTALL_NOTES_V14_PARTNERSHIPS_OPPORTUNITIES.md

git commit -m "Add partnerships and growth opportunities page"
git push origin main
```

## Cleanup

```bash
rm -rf _v14_preview
rm -f protreetrim-v14-partnerships-opportunities.zip
git status --short
```
