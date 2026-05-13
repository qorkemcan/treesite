# V14.1 — Partnerships Form Trailing Slash Fix

## What this fixes
The Partnerships inquiry form was posting to:

```text
/api/partnerships
```

The site uses `trailingSlash: "always"`, so Astro expects:

```text
/api/partnerships/
```

Without the trailing slash, local testing redirects to a 404 helper page instead of submitting the form.

## Changed file
- `src/pages/partnerships.astro`

## Install
From the ProTreeTrim repo root:

```bash
rm -rf _v14_1_preview
mkdir _v14_1_preview
unzip -o protreetrim-v14-1-partnerships-form-trailing-slash-fix.zip -d _v14_1_preview
node _v14_1_preview/protreetrim-v14-1-partnerships-form-trailing-slash-fix/scripts/install-v14-1-partnerships-form-trailing-slash-fix.mjs
```

If `npm run dev` is already open, Astro should hot-reload the changed file. Otherwise run:

```bash
npm run dev
```

Then retest:

```text
http://localhost:4321/partnerships/
```

Expected behavior after a successful submit:

```text
http://localhost:4321/partnership-thank-you/
```
