# Ahmad Hassan — Portfolio

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
├─ app/
│  └─ App.jsx               Page composition, case-study routing, ⌘K shortcut
├─ content/                 Everything editable lives here, not in components
│  ├─ site.js               Name, role, contact details, social links
│  ├─ projects.js           All 11 projects: summary, metrics, features, decisions, gallery
│  ├─ profile.js            Engineering decisions, principles, tech stack, experience
│  └─ story.js              The hero workstation loop (code → debug → ship)
├─ features/                One folder per page section
│  ├─ hero/                 Hero copy and the workstation stage (editor, CI, metrics screens)
│  ├─ work/                 Project grid, cards, coded covers and the case-study sheet
│  ├─ decisions/            "Decisions I'd defend in a review"
│  ├─ how-i-build/          Principles and tool stack
│  ├─ experience/           Roles and teams
│  ├─ contact/              Contact card and live local time
│  └─ command-palette/      ⌘K / Ctrl+K search
├─ layout/                  Page chrome: header, footer, backdrop, back-to-top, scroll effects
├─ components/              Shared UI: brand mark, count-up, section heading, split words, toast
├─ hooks/                   useInView, useCaseRoute
└─ styles/
   ├─ index.css             Single entry; import order defines the cascade
   ├─ base/                 Design tokens, reset, page primitives
   ├─ layout/               Header, footer
   ├─ components/           Buttons, section heading, lightbox, command palette, toast
   ├─ sections/             One file per page section (hero-stage/ is split by concern)
   ├─ motion/               Scroll reveals, hover and scroll-driven effects, header motion
   └─ responsive.css        Breakpoint overrides

public/
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

## Roadmap

Open work is tracked in [`docs/ROADMAP.md`](docs/ROADMAP.md).
