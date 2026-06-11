# CLAUDE.md

## Commands

```bash
npm start                # Dev server on port 3000
npm run build            # Production build (CI=false to suppress warnings as errors)
npm test                 # Jest test runner
npm run pretty           # Format with Prettier
npm run size             # size-limit check (main bundle ≤ 250 KB; enforced in CI)
npm run optimize-images  # sharp script: in-place downscale/re-encode of src/Assets
```

## Architecture

This is the Alpha Kappa Psi UCI Pi Psi chapter website — a Create React App (React 18, React Router v6) SPA deployed on Vercel. The 2026 redesign ("THE RECORD") is an editorial dark-luxury system: poster-scale Fraunces serif, mono data labels, hairline rules, brass/cobalt accents on warm ink.

### Routing

`src/App.jsx` defines all routes, every page is code-split via `React.lazy` (the ink curtain masks chunk loads). The `/:name` dynamic route renders `BrotherPage.jsx`; bad slugs fall through to a 404 with fuzzy "did you mean" roster suggestions (`src/utils/fuzzy.js`).

### Design system

- **`src/styles/tokens.css`** is the single source of truth: colors (`--bg-base #0B0B0C`, `--text-primary #F4F1EA` bone, `--accent-brass #C8A24B`, `--accent-cobalt #4E7FFF`, `--oxford #16243D`, `--bg-paper` for the one inverted section per page), hairlines, fluid type scale, spacing, easings, z-layers. Never hardcode hexes in page CSS.
- **Brass scarcity rule:** at most 2 brass elements per viewport. Brass = CTAs/active states only.
- **Fonts** are self-hosted woff2 in `public/fonts` (declared in `public/fonts/fonts.css`, preloaded in `index.html`): Fraunces Variable (display; `opsz` axis high for posters, WONK axis only on Rush), Switzer Variable (text; Fontshare license committed), Spline Sans Mono (labels/data — uppercase, 0.14em tracking via `.mono-label`).

### Chrome (shared shell, `src/Components/chrome/`)

- `Curtain.jsx` — ink-curtain route transitions; `CurtainLink` for internal links, `ChunkCover` as Suspense fallback. Navigation covers → swaps route → lifts.
- `Preloader.jsx` — first-visit monogram wipe (2.2s cap, sessionStorage skip).
- `SplitLines.jsx` — signature line-mask headline reveal (split-type; waits for `document.fonts.ready`, re-splits on resize).
- `Marquee.jsx`, `Magnetic.jsx`, `Cursor.jsx` (labeled chip via `data-cursor="VIEW|PLAY|DRAG"`), `Grain.jsx`, `Footer.jsx` (includes the reduce-motion toggle).
- `src/Components/effects/FloatPreview.jsx` + `floatCanvas.js` — lazy WebGL (ogl) displacement preview used by the Meet Us INDEX view; capability-gated with a plain-img fallback.

### Motion rules

Framer Motion only (no GSAP). Entrances use `[0.16, 1, 0.3, 1]`; curtain/menu use `[0.83, 0, 0.17, 1]`. Everything must respect `useMotionPrefs()` (`src/utils/useMotionPrefs.js`): OS reduced-motion OR footer toggle OR low-end device → effects off/fades only. Lenis smooth scroll is desktop-fine-pointer only (`src/utils/useLenis.js`). Animate transforms/opacity only.

### Data Sources

All dynamic content comes from Google Sheets through `src/utils/useSheet.js` (SWR + sessionStorage persistence; stale cache renders on quota/network failure — never a blank page). Loading states are hairline skeletons, never spinners.

The client fetches Google Sheets directly with the `REACT_APP_*` keys (`useSheet` picks the roster vs careers key by sheet id). These keys are inlined into the client bundle by CRA — a known, accepted trade-off (the chapter opted to keep client-side fetching rather than run a server proxy). If you ever want the keys off the client, reintroduce a Vercel serverless proxy that reads non-`REACT_APP_` server env vars; that was tried and reverted per chapter request — see [[akpsi-redesign-the-record]] memory.

- **Member data** — Sheet `167TmecKc4cduWtdounqiXDkYgQjssu9cSz4QLljuKLg`, range `Form Responses 1!C2:M`; env var `REACT_APP_ACTIVE_INFO_KEY`
- **Career data** — Sheet `1YY9TyYXJPHNJ8n1M2O9iKQaB00oCIghhkb5UpxTxV0g`, range `Form Responses 1!B2:G`; env var `REACT_APP_CAREERS_INFO_KEY` (CareerTable groups years dynamically — new sheet years appear without code changes)

Static asset data lives in `src/Assets/company.js` (company logos) and `src/Assets/headshot.js` (member headshots). All images/logos are barrel-exported from `src/Assets/index.js`.

### Copy rules (from chapter review)

No invented marketing copy or stats. Headlines/labels reuse existing site copy verbatim or neutral factual metadata ("PI PSI — UC IRVINE", "EST. 1904"). No placement counts, tooltips, or numeric claims beyond what pages already display.

### Styling

Per-page `.css` files consuming tokens only. MUI/emotion were removed — icons come from `lucide-react`; buttons use the shared `.hairline-button` / brass chip classes in tokens.css. Images go through `src/Components/Pic.jsx` (lazy, async decode, aspect-ratio placeholder).

### SEO

`react-helmet-async`; every page renders `<Seo title="…" />` (`src/Components/Seo.jsx`). Default meta/OG tags live in `public/index.html`.

### Responsive / Mobile

A `useMobile()` hook (768px breakpoint, exported from `Navbar.jsx`) handles conditional rendering. Mobile is first-class: roster grid is color-by-default (no hover dependence), Rush has a sticky brass APPLY bar, the menu is a full-screen ink takeover.

### Video Assets

Rush/cruise videos are served from CloudFront (CDN), not bundled; components use `canplay` to fade the video in over `--bg-base` (no spinner). The Rush page also plays a bundled mp3 (existing feature) with a sound toggle.

### Performance

- Images: keep `npm run optimize-images` rules in mind before committing new photos (max 1600px long edge; headshots 1000px). The repo was cut from 175MB → ~60MB of assets this way.
- `size-limit` runs in CI; main bundle budget 250KB gz (currently ~92KB brotli).
- `content-visibility`/lazy loading patterns: long lists use `loading="lazy"` via `Pic`.

### Environment Variables

`.env` (local) and the Vercel project both define:
```
REACT_APP_ACTIVE_INFO_KEY=<google-sheets-api-key>
REACT_APP_CAREERS_INFO_KEY=<google-sheets-api-key>
```
The client reads these directly. Because they're `REACT_APP_`-prefixed, CRA inlines them into the production bundle (the accepted trade-off above).
