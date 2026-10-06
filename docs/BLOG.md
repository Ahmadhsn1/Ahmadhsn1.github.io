# Blog plan

Where the writing lives: `src/content/posts.js`. Each post starts with `draft: true`; set it to `false` after reading it, then push. `VITE_INCLUDE_DRAFTS=1 npm run build` previews drafts.

## Why these topics

Generic explainers ("RAG chunking strategies", "what is tool calling") are already covered by Towards Data Science, DZone, Databricks and vendor docs. A new site cannot win those. What those pages lack is a real system with real numbers and a decision someone defended. Every post here is built around one decision from a shipped project in `projects.js`, so the facts are first hand and the angle is hard to copy.

Each post must leave the reader able to do something: working code, a test to run, or a checklist to apply on Monday morning.

## Writing rules

- First person, plain sentences, uneven rhythm. No dashes of any kind in the prose (rephrase "multi tenant", "top k" and so on).
- Only claim numbers that are in the project README. Never invent a story. The best upgrade to any post is one real moment from the owner ("this broke in production on...").
- Open with the answer (the `answer` field is shown as a highlighted summary and is what search and AI answers quote).
- Every post links to its case study and the case study links back (add the link on the case study when the post goes live).

## Keyword map

| Post | Primary query | Related queries | Intent | Source project |
| --- | --- | --- | --- | --- |
| vibe-coding-vs-learning-to-code-freshers | vibe coding vs learning to code | should i still learn to code in 2026, will ai replace junior developers, learn programming with ai, vibe coding problems in production, freshers roadmap | Fresher or career changer deciding how to learn | None (general guide, links to the other posts) |
| rag-tenant-isolation-vector-index | multi tenant rag isolation | vector search filter by user id, atlas vector search prefilter, rag data leak between users | Developer building a multi user RAG app | Retrivo Vault |
| ai-booking-assistant-tool-calling | llm tool calling booking assistant | chatbot book appointments llm, function calling business logic, llm agent otp confirmation | Developer or founder adding an AI assistant to a product | Aria |
| llm-rate-limits-bullmq-reschedule | bullmq llm rate limit | gemini 429 daily quota retry, bullmq RateLimitError, api key rotation llm | Node developer running LLM jobs | LeadForge AI, NoteMind |
| llm-chatbot-pipeline-cost-guardrails | reduce llm chatbot cost | llm response cache chatbot, chatbot guardrails prompt injection, sse streaming chatbot | Developer shipping a public chatbot | The Copper Larder |
| integer-money-row-level-security-postgres | store money as integer postgres | supabase row level security multi tenant, plpgsql transaction sale, pos system database design | Developer building a SaaS with payments or stock | RetailFlow |

## Keyword notes

No keyword tool with real volumes was available, so the phrases above come from SERP patterns (what titles and People Also Ask style questions the top results use). Before relying on them, check demand in Google Trends and, once the site is indexed, in Search Console (Performance, Queries). The freshers guide targets phrases with huge competition, so its edge is the specific angle: "freshers", Pakistan and South Asia, working code, and a 90 day plan.

## Queue (write next)

1. Offline first on Android: commit locally, upload with WorkManager (MindScribe, EasyQuran). Query: offline first android workmanager upload.
2. How I proved a test suite works by putting old bugs back (NoteMind). Query: how to test your tests, mutation testing practical.
3. Firestore security rules as the whole backend (SpendSmart). Query: firestore security rules deny by default example.
4. Adaptive coaching that asks before it changes anything (FitMind AI). Query: ai coach proposal approval human in the loop.
5. How to hire an AI engineer in Pakistan (commercial bridge, written last, once there are three technical posts to link to).

## Publishing checklist

1. Read the post out loud. If a sentence sounds like a brochure, rewrite it.
2. Check every number against the README.
3. `draft: false`, run `npm run check`, push.
4. Search Console: URL inspection, request indexing.
5. Share on LinkedIn (a short real takeaway, not a link dump) and cross post to Dev.to or Hashnode with the canonical URL pointing home.
6. Add a link from the case study page to the post.
7. After four weeks: look at Search Console queries for the page and tighten the title and first paragraph around the queries that show up.
