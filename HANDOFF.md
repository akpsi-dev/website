# AKPsi Website — Claude Code Handoff

## What I verified on your machine

| | |
|---|---|
| `C:\Users\Prana\website` | worktree on `redesign/the-record` — 8 commits ahead of main, all pushed |
| `C:\Users\Prana\website-main` | worktree on `main` — **the design that won the vote** |
| Stack | Create React App (`react-scripts` 5), React 18, React Router 6 |
| `CLAUDE.md` | already exists in **both** — don't run `/init`, you'd overwrite good context |
| Motion | `framer-motion` already in *both* branches' deps |

`website-main` is a real **git worktree**, not a second download — both share one `.git`. You already have the "work on a copy" setup you asked for.

---

## Step 0 — kill the line-ending noise FIRST

`git status` in `website` shows 80 modified files / 31,610 insertions / 31,610 deletions. Those numbers being identical is the tell: it's pure CRLF churn, **not real changes**. I confirmed it — `git diff --ignore-all-space` comes back completely empty.

```bash
cd C:\Users\Prana\website
git checkout -- .                 # safe: verified nothing real to lose
git config core.autocrlf input    # stops it recurring (Windows defaults to true)
```

Do the same `config` line in `website-main`. If you skip this, your first commit is a 31,000-line diff nobody can review.

**Also:** my read-only checks left two 0-byte lock files at `C:\Users\Prana\website\_to_delete\`. Harmless, just delete that folder. (I can't delete files on your machine, only move them.)

---

## Step 1 — branch, don't copy

```bash
cd C:\Users\Prana\website-main
git checkout -b polish/2026
```

Push it and Vercel auto-builds a **preview URL** for that branch. Production stays on `main` until you merge. That's your safety net — no manual copies, no risk to the live site.

---

## Step 2 — yes, move to the terminal

Claude Code in the terminal can run `npm start`, read actual build errors, and run tests. This session can't. Both `CLAUDE.md` files auto-load there, so you don't pay tokens re-explaining the project.

---

## Step 3 — the kickoff prompt

Paste this in `website-main` after branching:

```
Read CLAUDE.md. We're on branch polish/2026, cut from main. The chapter voted to KEEP
this design over redesign/the-record, so main's visual identity stays. Do not restyle.

Two jobs, in order:

1. AUDIT. Find: console errors, broken routes, mobile breaks under 768px, missing alt
   text, layout shift on image load, anything failing `npm run build`. Give me a
   numbered list with file:line and severity. Change nothing until I pick.

2. PORT from redesign/the-record. That branch is checked out at ../website — read files
   there directly, don't switch branches. In this order:
   - src/utils/useMotionPrefs.js   (must land before any motion work)
   - src/utils/useSheet.js         (SWR + sessionStorage; replaces raw axios)
   - src/Components/Pic.jsx        (lazy images, kills layout shift)
   Adapt each to main's MUI/emotion + existing CSS. Do NOT bring over src/styles/tokens.css.

Constraints: framer-motion only, easing [0.16,1,0.3,1], transform/opacity only, everything
respects useMotionPrefs. Don't touch .env or the Sheet IDs. Run `npm run build` before
claiming done. Ask before installing any dependency.
```

---

## What's actually worth porting

The vote was against the **look**, not the **engineering**. The redesign branch has real infra wins that are palette-agnostic:

**Take these:**

- `src/utils/useSheet.js` — SWR + sessionStorage. Renders stale cache when the Google Sheets quota dies instead of a blank page. `main` uses raw axios with no fallback. **Biggest reliability win available.**
- `src/utils/useMotionPrefs.js` — respects OS reduced-motion + low-end devices. Port before any animation work.
- `src/Components/Pic.jsx` — lazy load, async decode, aspect-ratio placeholder.
- `React.lazy` route code-splitting in `App.jsx`.
- `scripts/optimize-images.mjs` — cut repo assets 175MB → 60MB.
- `size-limit` bundle budget (CI-enforced, 250KB gz).
- `src/Components/Seo.jsx` + `react-helmet-async`.

**Motion, by effort:**

| Effort | What | Notes |
|---|---|---|
| Easy | framer-motion `whileInView` entrances | already in main's deps, zero install |
| Easy | `src/utils/useLenis.js` smooth scroll | self-contained, desktop-only. `npm i lenis` |
| Medium | `Magnetic.jsx`, `Marquee.jsx` | self-contained, light restyling |
| Medium | `SplitLines.jsx` line-mask headlines | `npm i split-type`, waits on `document.fonts.ready` |
| Skip | `Curtain.jsx`, `Cursor.jsx`, `Grain.jsx`, `FloatPreview.jsx` | tuned to the dark palette / WebGL-heavy |

**Don't port `src/styles/tokens.css`.** That dark editorial palette *is* the redesign identity people voted down.

⚠️ **Gotcha:** `main` uses MUI v6 + emotion. The redesign ripped MUI out for `lucide-react`. Anything you copy that referenced `.hairline-button` or tokens.css variables needs restyling against main's CSS.

---

## Plugins / MCP — use exactly one

Every MCP server loads its tool schemas into context on **every session**, used or not. That's a fixed tax. So:

- ✅ **chrome-devtools-mcp** — lets Claude open `localhost:3000`, read console errors, and screenshot. For "fix the bugs + tune motion," seeing the page is the difference between fixing and guessing.
- ❌ **GitHub / Vercel MCP** — skip. The `gh` and `vercel` CLIs cost *zero* context; Claude Code just runs them in Bash.

That's the general rule: **prefer a CLI over an MCP server** whenever one exists.

---

## Token hygiene

- `/clear` between unrelated tasks — single biggest saver. Dead context gets re-sent every turn.
- **Never paste file contents.** Give paths. It reads them itself, cheaper.
- One batched bug list, not one message per bug.
- `Shift+Tab` twice → **plan mode** for the port work. Fixing a plan is far cheaper than fixing wrong edits.
- Your `CLAUDE.md` files are already doing the heavy lifting — keep them updated as you go and every future session starts cheap.

---

## Loose end

`redesign/the-record` is 8 commits of finished work that lost a vote. Don't delete the branch — it stays on the remote as a free component library, which is exactly how you're using it above.
