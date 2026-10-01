# Ahmad Hassan — Portfolio

**Live:** https://ahmadhsn1.github.io

Personal site of **Ahmad Hassan**, AI Systems Engineer (full-stack · native Android), based in Lahore.

Built with **React 19** and **Vite**, with no UI framework and no runtime dependencies beyond React. Every project, number and decision on the site comes from the source repos on [github.com/Ahmadhsn1](https://github.com/Ahmadhsn1).

## Getting started

```bash
npm install
npm run dev       # local dev server with hot reload
npm run build     # production build into dist/
npm run preview   # serve the production build locally
npm run check     # lint + build, the gate before every push
```

Requires Node 20 or newer.

## Project structure

```
src/
├─ main.jsx                 Entry: mounts <App /> and loads the stylesheet
├─ entry-server.jsx         Server entry used at build time to prerender every page
├─ app/
│  ├─ App.jsx               Page composition, case-study routing, ⌘K shortcut
│  └─ ErrorBoundary.jsx     Calm fallback with contact details if rendering ever fails
├─ content/                 Everything editable lives here, not in components
│  ├─ site.js               Name, role, contact details, social links
│  ├─ projects.js           All 11 projects: summary, metrics, features, decisions, gallery
│  ├─ profile.js            Engineering decisions, principles, tech stack, experience
│  ├─ services.js           What I build, tied to real case studies
│  ├─ faq.js                Questions and plain-text answers (also feeds FAQ structured data)
│  └─ story.js              The hero workstation loop (code → debug → ship)
├─ features/                One folder per page section
│  ├─ hero/                 Hero copy and the workstation stage (editor, CI, metrics screens)
│  ├─ work/                 Project grid, cards, coded covers and the case-study sheet
│  ├─ services/             "What I build"
│  ├─ faq/                  Questions and answers
│  ├─ decisions/            "Decisions I'd defend in a review"
│  ├─ how-i-build/          Principles and tool stack
│  ├─ experience/           Roles and teams
│  ├─ contact/              Contact card and live local time
│  └─ command-palette/      ⌘K / Ctrl+K search
├─ layout/                  Page chrome: header, footer, backdrop, back-to-top, scroll effects
├─ components/              Shared UI: brand mark, count-up, section heading, split words, toast
├─ hooks/                   useInView, useCaseRoute, usePrefersReducedMotion
├─ seo/                     Per-page titles, descriptions, JSON-LD graph and head updates
├─ lib/                     Responsive image helper and generated size manifest
└─ styles/
   ├─ index.css             Single entry; import order defines the cascade
   ├─ base/                 Design tokens, reset, page primitives
   ├─ layout/               Header, footer
   ├─ components/           Buttons, section heading, lightbox, command palette, toast
   ├─ sections/             One file per page section (hero-stage/ is split by concern)
   ├─ motion/               Scroll reveals, hover and scroll-driven effects, header motion
   └─ responsive.css        Breakpoint overrides

scripts/
└─ prerender.mjs            Writes every page's HTML, sitemap.xml, robots.txt, llms.txt, 404.html, CNAME

public/
├─ og/<slug>.jpg            Share card for each case study (1200×630)
├─ images/hero/             Hero portrait (transparent WebP)
├─ images/projects/<slug>/  Real screenshots from each project's repo
├─ favicon.svg
└─ og.jpg                   Social share card (1200×630)
```

Imports use the `@/` alias for `src/` (configured in `vite.config.js` and `jsconfig.json`).

## Editing content

- **Contact details**: `src/content/site.js`. Setting `phone` enables the call and WhatsApp actions everywhere.
- **Add or update a project**: add an entry to `src/content/projects.js` and put its screenshots in `public/images/projects/<slug>/`. The grid, case study, filters and ⌘K palette pick it up automatically.
- **Engineering decisions, principles, stack, experience**: `src/content/profile.js`.

## Design system

The "Obsidian & Ember" tokens live in `src/styles/base/tokens.css`: near-black surfaces, warm ivory text and a single ember accent, set in Geist, Instrument Serif and Geist Mono. All motion respects `prefers-reduced-motion`.

## Performance

- Fonts are self-hosted (`@fontsource`), so there are no render-blocking third-party requests.
- Project screenshots ship as responsive WebP (`800w`/`1600w`, or `400w` for phone screens) through `src/lib/images.js`.
- The case study and command palette are code-split and prefetched when the browser is idle.
- Scroll reveals use an IntersectionObserver, and scroll progress is written once per animation frame to the two elements that read it.
- Animated layers are transform-only and GPU-composited, with no animated filters or blend modes.

Lighthouse on the production build: **98** desktop, **87** mobile (simulated slow 4G, 4× CPU).

## Search and AI visibility

The site is a React app, but every page is **prerendered to static HTML** at build time (`npm run build` → client build, server build, `scripts/prerender.mjs`). Search engines and AI crawlers that never run JavaScript still read the full content, and React hydrates the same markup in the browser.

- Each case study has a real URL (`/work/<slug>/`) with its own title, description, canonical, share card and structured data.
- Structured data (JSON-LD): `Person`, `ProfilePage`, `WebSite`, `FAQPage` on the home page; `WebPage`, `CreativeWork` and `BreadcrumbList` on each case study.
- `sitemap.xml`, `robots.txt` and `llms.txt` are generated from the same content files.
- After every deploy, CI pings IndexNow so Bing and other engines recrawl.

The strategy, checklists and manual steps are in [`docs/SEO.md`](docs/SEO.md).

## Deployment

Every push to `main` runs `.github/workflows/deploy.yml`: `npm ci` → lint → build → publish `dist/` to **GitHub Pages**. Pull requests run the same lint and build but don't deploy.

The public address lives in one place, `VITE_SITE_URL` in `.env`. Canonical and Open Graph tags, the sitemap and robots.txt are all generated from it. To move to a custom domain:

1. Point the domain's DNS at GitHub Pages (a `CNAME` record to `ahmadhsn1.github.io`, or GitHub's `A` records for an apex domain).
2. Set `VITE_SITE_URL=https://your-domain` and push. The build emits the `CNAME` file automatically.
3. In repo **Settings → Pages**, confirm the domain and enable **Enforce HTTPS**.

## Roadmap

Open work is tracked in [`docs/ROADMAP.md`](docs/ROADMAP.md).
