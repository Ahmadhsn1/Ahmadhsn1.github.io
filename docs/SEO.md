# Search and AI visibility

How this site is built to be found, and what still has to happen off-site. Last reviewed 2026-10-01.

## What is automated in the build

| Area | Where it lives |
| --- | --- |
| Prerendered HTML for every page | `src/entry-server.jsx`, `scripts/prerender.mjs` |
| Titles, descriptions, share cards per page | `src/seo/meta.js`, `public/og/` |
| JSON-LD graph (Person, ProfilePage, WebSite, FAQPage, CreativeWork, BreadcrumbList) | `src/seo/schema.js` |
| Sitemap, robots, llms.txt, 404, CNAME | `scripts/prerender.mjs` |
| IndexNow ping after each deploy | `.github/workflows/deploy.yml` |
| Public address (one line) | `VITE_SITE_URL` in `.env` |

## Principles

- Every claim on the page is backed by a repository, a store listing or a number in the code. No "best developer" self-labelling: search engines and AI assistants weight what *other* sources say.
- AI answers (Google AI Overviews, ChatGPT, Perplexity, Gemini) are built from the same index and from third-party mentions. Doing ordinary SEO well, plus having consistent facts about the same person across several sites, is the strategy. Google's own guidance says there is no special markup required.
- Links are earned or created on profiles the owner controls. No paid links, link exchanges, networks or expired domains.

## Keyword map (honest targets)

| Target | Page | Realistic horizon |
| --- | --- | --- |
| ahmad hassan, ahmadhsn1, ahmad hassan github | home | weeks |
| ahmad hassan software engineer lahore | home | weeks |
| ai engineer lahore, rag developer lahore, nestjs developer lahore, android developer lahore | home, case studies | 2–6 months |
| web developer lahore, software engineer lahore | home | 6–12 months with reviews and links |
| best web developer in lahore | n/a | needs reviews, directory listings and links; competitive |

## Off-site checklist

Done automatically:
- Search Console property verified, sitemap submitted, key URLs requested.
- Bing and other engines notified through IndexNow.
- GitHub repository topics and homepage fields point at the portfolio.

Needs the owner:
1. GitHub profile → Website: the portfolio URL.
2. LinkedIn → Contact info, Featured and About: portfolio link; ask past colleagues and clients for written recommendations.
3. Google Business Profile as a service-area business for Lahore (real contact details, no keyword stuffing in the name). This is the main lever for local results.
4. Bing Webmaster Tools: import the site from Search Console (ChatGPT search reads Bing's index).
5. Two to three technical write-ups (Dev.to, Hashnode or the owner's blog) about decisions from the case studies, each linking back to the matching `/work/<slug>/` page.
6. Listings on developer directories (Clutch, GoodFirms, DesignRush) once there are client reviews to show.
7. Launch posts for EasyQuran or LeadForge AI (Product Hunt, Hacker News "Show HN", relevant subreddits), written for readers, not for links.
8. A custom domain (for example ahmadhassan.tech): authority then belongs to the owner rather than to github.io. Change `VITE_SITE_URL`, push, and set the domain in the repo's Pages settings; GitHub redirects the old address.

## Monthly routine

1. Search Console → Performance: which queries and pages gain impressions; adjust titles and the FAQ to match real queries.
2. Search Console → Pages: anything not indexed, and why.
3. Add or refresh one case study or article; update `lastmod` by redeploying.
4. Check the brand queries (name, handle) and one local query in a private window.
