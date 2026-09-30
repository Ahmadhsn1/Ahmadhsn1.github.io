# Portfolio: Status & Remaining Work

Last updated: 2026-09-30

## ✅ Done

### Content, all from GitHub
- Every project re-read from its README on github.com/Ahmadhsn1. Numbers were updated where they have changed (FitMind **941 tests**, NoteMind **173 tests**, new repo names `notemind-ai` and `larder-concierge-ai`).
- **Real screenshots** from the repos: Retrivo Vault, LeadForge AI, NoteMind, SpendSmart, FitTrack, The Copper Larder, MindScribe. EasyQuran uses a screenshot of easyquran.app.
- Aria, FitMind (private repo) and RetailFlow (demo is behind a login) get **coded covers built from their real features**, clearly labelled as illustrations.
- **Full case study for every project** (`#/work/<slug>`, shareable links): overview, "What it does", engineering decisions, stack, metrics, screenshot gallery with lightbox, links.
- **"Decisions I'd defend in a review"**: the 10 engineering notes from the profile README, each linked to its project.
- **"How I build"**: the 7 rules and the tech stack from the profile README.
- **Experience**: EasyQuran (co-lead), Prime Coworking (Aria), open source.
- **Contact**: email `ahmad.hsn0099@gmail.com` (with copy button), LinkedIn, GitHub, live Lahore time.

### Branding
- "Ah" monogram logo (`BrandMark.jsx`), `public/favicon.svg`, OG/Twitter share image `public/og.jpg`, and JSON-LD `Person` schema.
- Title: "Ahmad Hassan — AI Systems Engineer".

### Interactivity (no magnetic hover anywhere)
- ⌘K / Ctrl+K command palette for projects, sections and contact actions.
- Case-study sheet: ←/→ between projects, Esc to close, the back button works.
- View Transitions animation on project filters, count-up stats, cursor spotlight on cards, scroll reveals, active-section nav indicator, copy-to-clipboard toast.
- Removed the 3D character and its libraries (three.js etc.), which were rejected.

## ⏳ Remaining

1. ~~Phone number~~ — added: +92 325 652 2522 (call + WhatsApp in Contact, footer and ⌘K).
2. ~~Hero character~~ — done: the Option C character (cut out from the ChatGPT render) stands in front of a full coding setup (live code, CI, metrics). **Next:** a sharper, full-resolution export of the character image, and later a rigged 3D model (the T-pose route) if you want him to animate.
3. **Deploy:** Vercel or Netlify (`npm run build` → `dist/`). After deploying, make `og:image` an absolute URL.
4. **Optional:** a real screenshot for RetailFlow (a logged-in demo view, taken by you) and the Aria widget (if it can be shared).

## Run locally

```bash
npm install
npm run dev
```
