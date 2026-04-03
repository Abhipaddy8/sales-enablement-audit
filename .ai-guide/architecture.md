# Sales Enablement Audit — Architecture & Tracker

## Project
- **Name**: Sales Enablement Audit
- **Client**: Marc McNamara / Northern Lights Consulting
- **Stack**: Next.js, Tailwind CSS
- **Deployed**: Vercel
- **Repo**: /Users/equipp/sales-enablement-audit

---

## Analytics & Tracking

### Google Analytics 4
- **Measurement ID**: `G-VLK10T5DMG`
- **Property**: Sales Enablement Audit
- **Account**: Google Ads Account (same as Royal College of Management)
- **Installed**: 2026-04-03
- **Location**: `src/app/layout.tsx` — Next.js `<Script>` component, `afterInteractive`
- **Tracks**: Page views, scrolls, outbound clicks, traffic sources, conversions, geographic data

### Microsoft Clarity
- **Project ID**: `w5rszmgybe`
- **Installed**: 2026-04-03
- **Location**: `src/app/layout.tsx` — Next.js `<Script>` component, `afterInteractive`
- **Tracks**: Heatmaps, session recordings, scroll depth, rage clicks, dead clicks
- **Dashboard**: https://clarity.microsoft.com

---

## Key Files
| File | Purpose |
|------|---------|
| `src/app/layout.tsx` | Root layout — GA4 + Clarity scripts |
| `src/app/page.tsx` | Landing page / audit form |
| `.ai-guide/architecture.md` | This file — project tracker |
