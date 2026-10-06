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

## Share cards (Open Graph images)

`npm run og` (`scripts/generate-og.mjs`) draws every 1200x630 share card with satori: the home page (with the character), one per case study (real screenshot, or the engineering decisions for products without public screens) and one per blog post (title, tags, a code excerpt from the post). Run it after changing a title, a metric or a post, then commit `public/og.jpg` and `public/og/`. The cards are plain JPEGs, so the build does not depend on the script. Social networks cache cards: after a change, refresh them with the LinkedIn Post Inspector and the Facebook Sharing Debugger.

## Page speed (Core Web Vitals)

Measured with Lighthouse on the production build, mobile profile: performance 92 (was 80), accessibility, best practices and SEO all 100; desktop performance 100. What got it there, and what keeps it there:

- The stylesheet is inlined into every prerendered page and the two hero fonts are preloaded (`scripts/prerender.mjs`), so first paint does not wait on a second request.
- The hero headline reveal finishes in about 1.2 seconds; a longer animation holds back Largest Contentful Paint because the headline is the largest element.
- Images carry explicit dimensions, so layout shift is about zero.
- `lastmod` in the sitemap and `dateModified` in structured data come from the last git commit that touched `src/`, `public/` or `index.html`, not from the build day. Search engines ignore a `lastmod` that changes on every deploy.

Remaining opportunity: the single JavaScript bundle (about 93 kB gzipped) hydrates the whole page; splitting the below-the-fold sections would cut Total Blocking Time further but needs lazy hydration, so it is not worth the risk until the numbers regress.

## Principles

- Every claim on the page is backed by a repository, a store listing or a number in the code. No "best developer" self-labelling: search engines and AI assistants weight what *other* sources say.
- AI answers (Google AI Overviews, ChatGPT, Perplexity, Gemini) are built from the same index and from third-party mentions. Doing ordinary SEO well, plus having consistent facts about the same person across several sites, is the strategy. Google's own guidance says there is no special markup required.
- Links are earned or created on profiles the owner controls. No paid links, link exchanges, networks or expired domains.

## How the result looks in Google

- **Site name.** On a `*.github.io` address Google falls back to "GitHub" as the site name until it has re-read the `WebSite` structured data (`name`, `alternateName`) and the `og:site_name` / `application-name` tags, which are all in place. It can take days to weeks to change. A custom domain removes the ambiguity entirely.
- **Favicon.** Google needs a square icon whose size is a multiple of 48px, reachable from the home page: `favicon.ico`, `favicon-48.png` and `favicon-96.png` are linked in `index.html`. Until Google fetches it, a grey globe is shown.
- **Title and description** come from `src/seo/meta.js`. Google may rewrite them to fit the query; keeping the title under about 60 characters and the description under about 155 gives the best chance they are used as written.
- Changes only show after Google recrawls the page. Use Search Console → URL inspection → Request indexing (about 10 requests per day).

## Positioning

Profile copy for LinkedIn, GitHub and the CV is in [BRAND.md](BRAND.md).

One role label, **Full-Stack AI Engineer**, defined once as `site.role` in `src/content/site.js` and used for the page title, header, hero, footer, structured data (`jobTitle`) and web manifest. The longer `site.headline` ("Full-stack engineer and AI engineer in Lahore, Pakistan") carries both search phrases separately for the description, `llms.txt` and structured data. Change the wording there, not in individual components. Two places cannot import it and must be edited by hand to match: the static fallback copy in `index.html`, and the text baked into `public/og.jpg`.

## Keyword map (honest targets)

| Target | Page | Realistic horizon |
| --- | --- | --- |
| ahmad hassan, ahmadhsn1, ahmad hassan github | home | weeks |
| ahmad hassan full stack ai engineer, ahmad hassan ai engineer lahore | home | weeks |
| full stack ai engineer pakistan, full stack engineer lahore, ai engineer lahore | home | 2–6 months |
| rag developer lahore, nestjs developer lahore, android developer lahore | home, case studies | 2–6 months |
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
