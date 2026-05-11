# ProTreeTrim V7 - Florida Weather / Storm Alert Mode

This package adds a lightweight, static-friendly storm alert banner system.

## Files added

- `src/components/WeatherAlertBanner.astro`
- `src/data/site-alert.json`
- `src/data/weather-advice-rules.json`
- `scripts/update-weather-alerts.mjs`
- `.github/workflows/update-weather-alerts.yml`

## File updated

- `src/layouts/MainLayout.astro`

## What it does

- Shows no banner by default.
- Allows a manual alert by editing `src/data/site-alert.json`.
- Adds a GitHub Action that can fetch active Florida alerts from the National Weather Service API and update the static JSON file.
- Keeps language cautious and safety-focused, not panic-driven.

## Manual test

To preview the banner, temporarily set `enabled` to `true` and `mode` to `watch` in `src/data/site-alert.json`, then run:

```bash
npm run build
npm run dev
```

Return `enabled` to `false` before publishing if you do not want the banner visible.

## GitHub Actions note

After merging this package, GitHub Actions can be run manually from:

Actions → Update Florida weather alert banner → Run workflow

The scheduled workflow runs every 6 hours. If the JSON changes, it commits the update and Vercel deploys automatically.
