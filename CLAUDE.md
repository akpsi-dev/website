# CLAUDE.md

## Commands

```bash
npm start          # Dev server on port 3000
npm run build      # Production build (CI=false to suppress warnings as errors)
npm test           # Jest test runner
npm run pretty     # Format with Prettier
```

## Architecture

This is the Alpha Kappa Psi UCI Pi Psi chapter website — a Create React App (React 18, React Router v6) SPA deployed on Vercel.

### Routing

`src/App.jsx` defines all routes. The `/:name` dynamic route renders `BrotherPage.jsx`, which fetches an individual member's data from Google Sheets using the URL param.

### Data Sources

All dynamic content comes from Google Sheets via the Google Sheets API (axios HTTP, keys in `.env`):

- **Member data** — Sheet `167TmecKc4cduWtdounqiXDkYgQjssu9cSz4QLljuKLg`, range `Form Responses 1!C2:M`; env var `REACT_APP_ACTIVE_INFO_KEY`
- **Career data** — Sheet `1YY9TyYXJPHNJ8n1M2O9iKQaB00oCIghhkb5UpxTxV0g`, range `Form Responses 1!B2:G`; env var `REACT_APP_CAREERS_INFO_KEY`

Static asset data lives in `src/Assets/company.js` (company logos) and `src/Assets/headshot.js` (member headshots). All images/logos are barrel-exported from `src/Assets/index.js`.

### Styling

Mixed approach: MUI v6 with emotion for component-level styling (see `SleekButton.jsx` for the `styled()` pattern), plus per-page `.css` files (e.g., `Home.css`, `Careers.css`). Global styles are in `src/index.css`.

### Animations

Framer Motion throughout — use `whileInView` / `initial` / `animate` with the easing `[0.16, 1, 0.3, 1]` to match existing patterns.

### Responsive / Mobile

A `useMobile()` hook (768px breakpoint) handles conditional rendering between desktop and mobile layouts. The Navbar uses this for the hamburger menu.

### Video Assets

Rush videos are served from CloudFront (CDN), not bundled. The component uses a `canplay` event to detect load completion before showing the video.

### Environment Variables

`.env` must define:
```
REACT_APP_ACTIVE_INFO_KEY=<google-sheets-api-key>
REACT_APP_CAREERS_INFO_KEY=<google-sheets-api-key>
```
