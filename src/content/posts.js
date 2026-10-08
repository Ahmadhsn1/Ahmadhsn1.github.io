// Technical write-ups. Every number and design decision about a project comes from that project's
// README (see projects.js); the rest is general engineering the reader can reuse. See docs/BLOG.md
// for the keyword plan and the writing rules (first person, plain sentences, no dashes in prose).
//
// `draft: true` keeps a post out of the blog index, sitemap, RSS and search results. A post whose `published`
// day (or exact `publishAt`, for example '2026-10-10T09:00:00+05:00') is still in the future is hidden the same way
// and appears on the first deploy after that moment. `VITE_INCLUDE_DRAFTS=1 npm run build` previews everything.
//
// Body blocks: {type: 'p' | 'code' | 'list', ...}. Inside text, [label](/path/) renders as a link and
// `name` renders as inline code.

export const posts = [
	{
		slug: 'ai-coding-agents-workflow-that-holds-up',
		draft: false,
		title: 'AI Coding Agents: A Workflow That Holds Up',
		description: 'A practical agentic coding workflow: clear tickets, plans first, tests as guardrails, an AGENTS.md file and a review checklist that suits any coding agent.',
		published: '2026-10-10',
		publishAt: '2026-10-10T09:00:00+05:00',
		updated: '2026-10-10',
		project: null,
		tags: ['AI coding agents', 'Agentic coding', 'Developer workflow', 'Code review'],
		answer:
			'Treat a coding agent like a fast colleague who needs a clear ticket and a way to check its own work. Write the task with acceptance criteria, ask for a plan before any code, give the agent commands that prove the change works, keep every diff small, and review it as the owner. Speed is the agent’s job. Judgment stays with you.',
		sections: [
			{
				heading: 'Where the time goes now',
				blocks: [
					{
						type: 'p',
						text: 'Coding agents write and change code quickly, and they follow instructions well. That shifts where the effort goes in a project. Less of it is typing. More of it lands in two places: saying exactly what you want, and checking that you got it.',
					},
					{
						type: 'p',
						text: 'Both are old engineering skills. Writing a clear ticket and reviewing a change were always part of the job, and they matter more now because the cost of producing a change has dropped while the cost of understanding it has not. The workflow below does not depend on any vendor. It works whether your agent lives in a terminal, an editor or a pull request bot.',
					},
				],
			},
			{
				heading: 'Write the task like a ticket',
				blocks: [
					{
						type: 'p',
						text: 'An agent fills every gap you leave with its own best guess. A vague request returns a confident answer to a question you did not quite ask. A useful task has four parts: the goal, the constraints, how to tell it is done, and what is out of scope.',
					},
					{
						type: 'code',
						lang: 'text',
						text: `Goal
Add a "resend verification email" button to the account page.

Constraints
Reuse the existing sendVerificationEmail service. Do not add dependencies.
Limit resends to 3 per hour per user.

Done when
* A signed in user with an unverified email sees the button.
* The fourth request within an hour returns a 429 and shows a clear message.
* Tests cover the limit and the already verified case.

Out of scope
Email template changes, the signup flow, anything under /billing.`,
					},
					{
						type: 'p',
						text: 'The last section matters more than it looks. Without it, an agent will helpfully tidy things you never mentioned, and you end up reviewing a larger change than the one you wanted.',
					},
				],
			},
			{
				heading: 'Ask for a plan before any code',
				blocks: [
					{
						type: 'p',
						text: 'For anything beyond a small edit, ask the agent to read the code and propose a plan, and do not let it change files until you have read that plan. Most agents have a planning or read only mode for exactly this. A plan is cheap to read and cheap to correct. A wrong plan caught here saves a wrong implementation and the review that would have followed.',
					},
					{
						type: 'p',
						text: 'When I read a plan I check three things. Does it touch only the files I expect? Does it reuse code that already exists instead of writing a parallel copy? Does it say how the change will be tested? If a plan proposes a new dependency or a new pattern, I ask why before it writes a line.',
					},
				],
			},
			{
				heading: 'Make correctness something the agent can run',
				blocks: [
					{
						type: 'p',
						text: 'The biggest single improvement to agent output is giving it a way to check itself. If tests, type checks and linting run with one command, the agent can change code, run the command, read the failures and fix them without you in the loop.',
					},
					{
						type: 'code',
						lang: 'json',
						text: `{
  "scripts": {
    "check": "eslint . && tsc --noEmit && vitest run"
  }
}`,
					},
					{
						type: 'p',
						text: 'Tell the agent in plain words to run that command before it says the task is finished. Better still, start from a failing test that describes the behaviour you want and let the agent make it pass. A test you wrote is a specification. A test the agent wrote for its own code can quietly confirm its own assumptions, so read those more closely than the code itself.',
					},
				],
			},
			{
				heading: 'Keep every change small',
				blocks: [
					{
						type: 'p',
						text: 'Review quality falls quickly as a diff grows. A change you can read in a few minutes gets a real review. A change spread over thirty files gets a skim. Ask for one concern at a time, commit at checkpoints, and treat a revert as an ordinary tool instead of a failure.',
					},
					{
						type: 'p',
						text: 'You can enforce this instead of hoping for it. This script fails the build when a change is bigger than you agreed to review. Run it in CI against the branch you are merging.',
					},
					{
						type: 'code',
						lang: 'js',
						text: `import { execFileSync } from 'node:child_process'

const base = process.env.BASE_REF ?? 'origin/main'
const maxFiles = 15
const maxLines = 400

const stat = execFileSync('git', ['diff', '--numstat', base + '...HEAD'], { encoding: 'utf8' })
const rows = stat.trim().split('\\n').filter(Boolean).map((line) => line.split('\\t'))
const files = rows.length
const lines = rows.reduce((sum, [added, removed]) => sum + (Number(added) || 0) + (Number(removed) || 0), 0)

if (files > maxFiles || lines > maxLines) {
  console.error('Diff budget exceeded: ' + files + ' files, ' + lines + ' changed lines. Split this change.')
  process.exit(1)
}
console.log('Diff within budget: ' + files + ' files, ' + lines + ' lines')`,
					},
					{
						type: 'p',
						text: 'Fifteen files and four hundred lines are a starting point, not a rule. Pick limits your team can genuinely review, and exclude lockfiles and generated files once they start causing false alarms.',
					},
				],
			},
			{
				heading: 'Teach the repository with an instructions file',
				blocks: [
					{
						type: 'p',
						text: 'An agent begins each session knowing nothing about your project. Most tools read a plain text instructions file from the root of the repository. AGENTS.md has become a common shared name that several tools understand, and some tools also read a file of their own, such as CLAUDE.md. If your team uses more than one tool, keeping the shared rules in one place avoids them drifting apart.',
					},
					{
						type: 'p',
						text: 'What goes in it is short and practical: the commands to build and test, the conventions that are not obvious from reading the code, the folders that are off limits, and the mistakes that have happened before. Start small. Add a line when you see the same mistake twice, and where you can, add a test that fails if it returns, so the rule is enforced and not merely written down.',
					},
					{
						type: 'code',
						lang: 'text',
						text: `# AGENTS.md

## Commands
* Run everything with: npm run check
* Never run the seed script against a shared database.

## Conventions
* Money is stored as integer minor units. Never use floats for amounts.
* New endpoints validate input with the shared schemas in src/schemas.

## Off limits
* Do not edit src/generated or any migration that has already run.`,
					},
				],
			},
			{
				heading: 'Review it as the owner',
				blocks: [
					{
						type: 'p',
						text: 'When a pull request arrives, the reflex is to open the changed files. Start one step earlier. Read the task, decide what a correct change would look like, and then compare. Reviewing against intent catches the most expensive problem of all, a change that is neat and well tested and solves the wrong thing.',
					},
					{
						type: 'list',
						items: [
							'Scope. Did it do what the task asked and nothing more?',
							'Edge cases. Empty input, a repeated click, a missing record, a slow network.',
							'Security. Who is allowed to call this? Is every input validated? Are secrets kept out of the code and the logs?',
							'Dependencies. Did it add a package, and is that justified?',
							'Performance. Queries inside loops, lists with no limit, whole files loaded into memory.',
							'Tests. Would they fail if the feature were broken?',
						],
					},
					{
						type: 'p',
						text: 'This kind of review rests on fundamentals. If you are earlier in your career, the guide on [vibe coding versus learning to code](/blog/vibe-coding-vs-learning-to-code-freshers/) covers the basics that make it possible.',
					},
				],
			},
			{
				heading: 'Know when to take the keyboard back',
				blocks: [
					{
						type: 'p',
						text: 'Some situations are better handled by hand, or at least with you driving closely.',
					},
					{
						type: 'list',
						items: [
							'The same error has come back three times in a row.',
							'The requirement is unclear and the agent is guessing between interpretations.',
							'The code is security sensitive: authentication, permissions or payments.',
							'The action cannot be undone, such as a data migration or a delete.',
						],
					},
					{
						type: 'p',
						text: 'Apply the same least privilege you would give a new teammate. Work on a branch, keep production credentials out of reach, and restrict destructive commands so a bad guess costs you a revert and not a recovery.',
					},
				],
			},
			{
				heading: 'The loop in one place',
				blocks: [
					{
						type: 'list',
						items: [
							'Write the ticket with a goal, constraints, a definition of done and what is out of scope.',
							'Ask for a plan and read it before any file changes.',
							'Have the agent run the check command and fix what fails.',
							'Keep the diff small enough to review properly.',
							'Review against intent, then against the checklist.',
							'Record any repeated mistake in the instructions file, ideally with a test.',
						],
					},
					{
						type: 'p',
						text: 'Expect the first few tasks to feel slower while you write tickets and set up checks. The payoff is that the output starts arriving in a state you can trust and review quickly, and that is where the time saving from an agent actually comes from.',
					},
				],
			},
		],
	},

	{
		slug: 'azure-openai-outage-keep-ai-app-running',
		draft: false,
		title: 'Azure OpenAI Outage: Keep Your AI App Running',
		description: 'A nearly six hour Azure OpenAI outage on 29 September 2026 is a reminder that LLM APIs fail. Timeouts, circuit breakers and fallbacks, with code.',
		published: '2026-10-08',
		updated: '2026-10-08',
		project: 'copper-larder',
		tags: ['Azure OpenAI', 'LLM reliability', 'Node.js', 'Outages'],
		answer:
			'Treat your LLM provider like any dependency that will eventually fail. Set strict timeouts, stop calling a provider that is clearly down with a circuit breaker, and keep a second route ready, whether that is another region, another provider or an honest degraded mode. Retries alone will not save you from an outage that lasts six hours.',
		sections: [
			{
				heading: 'What happened on 29 September',
				blocks: [
					{
						type: 'p',
						text: 'According to a [postmortem write up by Artur Markus](https://www.arturmarkus.com/postmortem-azures-sweden-central-ai-outage-and-the-18-region-gateway-failure-24-hours-later/), Azure OpenAI Service, Foundry Agent Service, Foundry Models and Cognitive Services in the Sweden Central region failed for 5 hours and 55 minutes on 29 September 2026, from 10:03 to 15:58 UTC. Customers saw intermittent request failures, higher latency and HTTP 5XX errors against model and data plane APIs. Every cloud and model provider has incidents at some point, so this is not a post about blame. It is about how to engineer for the day it happens to you.',
					},
					{
						type: 'p',
						text: 'The same write up mentions a separate networking incident the next day across several regions, but I am not drawing conclusions from it because those details have not been confirmed. For the confirmed record, the official [Azure status history](https://azure.status.microsoft/en-us/status/history) is the place to look, rather than anyone’s summary, including mine.',
					},
					{
						type: 'p',
						text: 'The details of this incident matter less than its shape. A model API in one region was unusable for most of a working day. If your product calls an LLM on the critical path, that is your outage too, and the question is what your code does during hour three.',
					},
				],
			},
			{
				heading: 'Why retries are the wrong tool here',
				blocks: [
					{
						type: 'p',
						text: 'Retries are built for blips: a dropped connection, a single overloaded node. Against a six hour incident they do harm. Every user request waits through several failed attempts, your workers pile up, your queue grows, and when the provider recovers it receives a flood.',
					},
					{
						type: 'p',
						text: 'The first step is to stop treating all errors the same. I sort them into three groups, because each one has a different correct reaction.',
					},
					{
						type: 'list',
						items: [
							'A rate limit (HTTP 429) means not now. Reschedule the work instead of burning attempts, as described in [Do Not Retry an LLM Rate Limit, Reschedule It](/blog/llm-rate-limits-bullmq-reschedule/).',
							'A client error (most other 4XX) means your request is wrong. Retrying changes nothing. Fix the request.',
							'An outage signal, meaning a timeout, a connection reset or a 5XX, means the provider is unhealthy. This is the group that needs a breaker and a fallback.',
						],
					},
				],
			},
			{
				heading: 'Timeouts come first',
				blocks: [
					{
						type: 'p',
						text: 'Without a timeout, an LLM call can hang for minutes and hold a connection, a worker and a user. Set one on every call, and choose it from what a healthy call looks like for your use case. A short classification should answer in a few seconds. A long generation needs a longer limit, and when you stream it is worth watching time to first token separately, because that is the number that tells you the provider is struggling.',
					},
					{
						type: 'code',
						lang: 'js',
						text: `const isOutage = (error) =>
  error.name === 'TimeoutError' ||
  error.code === 'ECONNRESET' ||
  (error.status >= 500 && error.status < 600)

export async function callProvider(provider, messages) {
  const signal = AbortSignal.timeout(provider.timeoutMs)
  return provider.chat(messages, { signal })
}`,
					},
				],
			},
			{
				heading: 'A circuit breaker in twenty lines',
				blocks: [
					{
						type: 'p',
						text: 'A circuit breaker remembers that a dependency is failing and stops sending it traffic for a while. That protects your users from waiting on a dead service and protects the service from a retry storm when it comes back.',
					},
					{
						type: 'code',
						lang: 'js',
						text: `export class CircuitBreaker {
  constructor({ threshold = 5, coolDownMs = 30000 } = {}) {
    this.threshold = threshold
    this.coolDownMs = coolDownMs
    this.failures = 0
    this.openUntil = 0
  }

  allows(now = Date.now()) {
    return now >= this.openUntil
  }

  success() {
    this.failures = 0
    this.openUntil = 0
  }

  failure(now = Date.now()) {
    this.failures += 1
    if (this.failures >= this.threshold) {
      this.openUntil = now + this.coolDownMs
    }
  }
}`,
					},
					{
						type: 'p',
						text: 'After the cool down, allows returns true again and the next request acts as a probe. If it fails, the failure count is still above the threshold, so the breaker opens again straight away. If it succeeds, everything resets. That is the whole idea, and it is enough for most services.',
					},
				],
			},
			{
				heading: 'A fallback chain',
				blocks: [
					{
						type: 'p',
						text: 'With timeouts and a breaker per provider, the fallback is a loop over an ordered list. Each entry has a name, a chat function, a timeout and its own breaker.',
					},
					{
						type: 'code',
						lang: 'js',
						text: `export async function askWithFallback(providers, messages) {
  let lastError

  for (const provider of providers) {
    if (!provider.breaker.allows()) continue
    try {
      const reply = await callProvider(provider, messages)
      provider.breaker.success()
      return { reply, provider: provider.name }
    } catch (error) {
      if (!isOutage(error)) throw error
      provider.breaker.failure()
      lastError = error
    }
  }

  throw lastError ?? new Error('Every provider is unavailable')
}`,
					},
					{
						type: 'p',
						text: 'Two cautions. A second region protects you from a regional failure like Sweden Central, but not from a problem that spans the provider, so for the critical path a second provider is the stronger choice. And a fallback model is not a drop in copy. Prompts that work well on one model can behave differently on another, so keep a small set of real examples and run it against every provider you list. A fallback you have never tested is a hope, not a plan.',
					},
					{
						type: 'p',
						text: 'This is easier when your code never imports a vendor SDK directly. If each provider is an adapter behind one small interface, adding a second is an afternoon of work. The same design is used in the booking assistant described in [An AI Booking Assistant That Cannot Double Book](/blog/ai-booking-assistant-tool-calling/).',
					},
				],
			},
			{
				heading: 'Decide what failure looks like for the user',
				blocks: [
					{
						type: 'p',
						text: 'When every route is down, the worst outcome is a spinner that never ends. Decide in advance. Background work can go into a queue and run later. A chat can say plainly that the assistant is unavailable and offer another way to reach you. Something that has a cached answer can serve it, clearly marked.',
					},
					{
						type: 'p',
						text: 'The Copper Larder chatbot takes this approach: when the model is down, rate limited or missing its key, every path still returns a warm, on brand message and a callback card, so a visitor can still leave a number. The design is covered in the [Copper Larder case study](/work/copper-larder/).',
					},
				],
			},
			{
				heading: 'Test the failure before it finds you',
				blocks: [
					{
						type: 'p',
						text: 'You do not need a real outage to rehearse one. Write a fake provider that returns a 503, another that hangs past its timeout, and a healthy one, then assert how your code behaves.',
					},
					{
						type: 'code',
						lang: 'js',
						text: `import test from 'node:test'
import assert from 'node:assert'

const broken = {
  name: 'broken',
  timeoutMs: 100,
  breaker: new CircuitBreaker({ threshold: 1 }),
  chat: async () => { throw Object.assign(new Error('down'), { status: 503 }) },
}
const healthy = {
  name: 'healthy',
  timeoutMs: 100,
  breaker: new CircuitBreaker(),
  chat: async () => 'ok',
}

test('falls back when the first provider is down', async () => {
  const result = await askWithFallback([broken, healthy], [])
  assert.equal(result.provider, 'healthy')
  assert.equal(broken.breaker.allows(), false)
})`,
					},
					{
						type: 'p',
						text: 'Run something like this in CI, and once in a while rehearse it for real by pointing a staging environment at a provider that always fails. You will find the one forgotten call that has no timeout.',
					},
				],
			},
			{
				heading: 'A short checklist',
				blocks: [
					{
						type: 'list',
						items: [
							'Every LLM call has a timeout, and the limit matches what a healthy call looks like.',
							'Rate limits, client errors and outage signals are handled differently.',
							'Each provider has a circuit breaker, and the order of providers is explicit.',
							'The fallback has been tested against your own prompts, not just reached.',
							'There is a written answer to what the user sees when everything is down.',
						],
					},
				],
			},
		],
	},

	{
		slug: 'rtx-spark-local-ai-developers',
		draft: false,
		title: 'RTX Spark and Local AI: A Developer Briefing',
		description: 'Microsoft’s Surface Laptop Ultra brings Nvidia RTX Spark and 128 GB of unified memory. What local AI means for developers, with the memory math.',
		published: '2026-10-07',
		updated: '2026-10-07',
		project: null,
		tags: ['Local AI', 'Nvidia', 'Windows', 'LLM inference'],
		answer:
			'Microsoft’s Surface Laptop Ultra, announced on 7 October 2026, puts Nvidia’s RTX Spark and up to 128 GB of unified memory in a laptop, so large models can run on the device. For developers the useful question is which requests should stay local. That depends on memory math, latency, privacy and having one interface in your code that can talk to both a local model and a cloud one.',
		sections: [
			{
				heading: 'What Microsoft and Nvidia announced',
				blocks: [
					{
						type: 'p',
						text: 'At its 7 October event in San Francisco, Microsoft introduced the Surface Laptop Ultra, built around Nvidia’s RTX Spark. Coverage from [BGR](https://www.bgr.com/2279488/windows-surface-event-october-2026-liveblog-updates/), [Notebookcheck](https://www.notebookcheck.net/Microsoft-Surface-Laptop-Ultra-debuts-with-RTX-Spark-128-GB-unified-memory-and-2-599-starting-price.1418420.0.html) and [Engadget](https://engadget.com/2279642/microsoft-windows-surface-event-2026-live-blog-nvidia-rtx-spark-laptop-ultra) agrees on the main points.',
					},
					{
						type: 'list',
						items: [
							'RTX Spark combines a Grace CPU with a Blackwell GPU that has 6,144 cores, and the CPU and GPU share one pool of unified memory, up to 128 GB.',
							'The Surface Laptop Ultra starts at $2,599 with 24 GB of memory, with preorders open and availability from 16 October. A Surface RTX Spark Dev Box is listed at $5,999.',
							'Laptops from Lenovo, Asus, Dell, MSI and HP with RTX Spark were also announced, shipping from 16 October.',
							'Windows gets hybrid behaviour that decides between local and cloud models, Copilot access to local files with permission, and Microsoft Execution Containers to contain what agents can do.',
						],
					},
					{
						type: 'p',
						text: 'A few details differ between outlets, such as which specific open models were named and how much RAM they need, so I am relying only on the hardware and platform points that several sources agree on. Microsoft’s own product page is the place to confirm final specs and prices, and independent benchmarks will fill in the performance picture.',
					},
				],
			},
			{
				heading: 'Why unified memory is the headline',
				blocks: [
					{
						type: 'p',
						text: 'Running a language model locally is mostly a question of whether the weights fit in memory the GPU can reach. On a typical laptop with a discrete GPU, that memory is small, and the model has to be squeezed to fit. With unified memory, the CPU and GPU draw from the same pool, so a 128 GB machine can hold models that used to need a workstation.',
					},
					{
						type: 'p',
						text: 'Capacity is only half the story. How fast the memory can feed the chip decides how many tokens per second you get, and I have not seen verified bandwidth or throughput numbers yet. That is why independent benchmarks are worth waiting for.',
					},
				],
			},
			{
				heading: 'The memory math',
				blocks: [
					{
						type: 'p',
						text: 'You can estimate whether a model fits with one line of arithmetic. The weights take roughly parameters times bits per weight, divided by eight.',
					},
					{
						type: 'code',
						lang: 'js',
						text: `// Weights only, in gigabytes, for a model with paramsBillions parameters.
export const weightsGB = (paramsBillions, bitsPerWeight) =>
  (paramsBillions * bitsPerWeight) / 8

weightsGB(8, 4)    // 4
weightsGB(70, 4)   // 35
weightsGB(70, 16)  // 140
weightsGB(675, 4)  // 337.5`,
					},
					{
						type: 'list',
						items: [
							'An 8 billion parameter model at 4 bits per weight needs about 4 GB. It fits almost anywhere.',
							'A 70 billion parameter model at 4 bits needs about 35 GB. It fits on a 128 GB machine with room to spare, and not on a 24 GB one.',
							'The same 70 billion model at 16 bits needs about 140 GB. It does not fit on 128 GB.',
							'A sparse mixture of experts model is the trap. [Mistral Large 3](https://intuitionlabs.ai/articles/mistral-large-3-moe-llm-explained) has 675 billion parameters in total but only 41 billion active per token. Active parameters set the speed, while total parameters set the memory, so at 4 bits it needs about 338 GB resident. It will not run on a laptop however few experts fire.',
						],
					},
					{
						type: 'p',
						text: 'Treat the result as a floor. The attention cache grows with context length and with each concurrent session, and the runtime needs working space. As a starting guess I leave about 20 percent of memory free, then measure with the real context length my application uses.',
					},
				],
			},
			{
				heading: 'Local or cloud: write the rule down',
				blocks: [
					{
						type: 'p',
						text: 'Having the hardware does not mean everything should run on it. I decide per request type, using five questions.',
					},
					{
						type: 'list',
						items: [
							'Privacy. Does the input contain data that should not leave the device?',
							'Latency and offline use. Does the feature need to respond instantly or work without a connection?',
							'Cost. Is it called so often that per token pricing adds up?',
							'Quality ceiling. Does the task need the strongest model available, or is a good enough one fine?',
							'Context and load. Does it need a very long context, or will traffic spike beyond one machine?',
						],
					},
					{
						type: 'p',
						text: 'In general, private documents, autocomplete, classification and first drafts are good local candidates. The hardest reasoning, very long contexts and bursty workloads still belong in the cloud. Most real products will use both, which is why the next part matters.',
					},
				],
			},
			{
				heading: 'One interface, two backends',
				blocks: [
					{
						type: 'p',
						text: 'Most local runtimes expose an OpenAI compatible HTTP API. The llama.cpp server, for example, serves chat completions on a local port, so the client code is the same and only the base URL changes. Put that behind one function and the rest of your app never needs to know where a request ran.',
					},
					{
						type: 'code',
						lang: 'js',
						text: `const backends = {
  local: { baseUrl: 'http://localhost:8080/v1', model: 'local' },
  cloud: { baseUrl: process.env.CLOUD_BASE_URL, model: process.env.CLOUD_MODEL, key: process.env.CLOUD_KEY },
}

async function chat(backend, messages, timeoutMs) {
  const response = await fetch(backend.baseUrl + '/chat/completions', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(backend.key ? { authorization: 'Bearer ' + backend.key } : {}),
    },
    body: JSON.stringify({ model: backend.model, messages }),
    signal: AbortSignal.timeout(timeoutMs),
  })
  if (!response.ok) throw Object.assign(new Error('request failed'), { status: response.status })
  const data = await response.json()
  return data.choices[0].message.content
}

export async function complete(messages, { private: isPrivate = false } = {}) {
  if (isPrivate) return chat(backends.local, messages, 60000) // never leaves the device
  try {
    return await chat(backends.local, messages, 8000)
  } catch {
    return chat(backends.cloud, messages, 30000)
  }
}`,
					},
					{
						type: 'p',
						text: 'Notice the private flag. Falling back to the cloud when the local model is slow is a convenience for ordinary requests. For sensitive input it would defeat the point, so those calls wait for the local model and fail instead of leaving the machine.',
					},
				],
			},
			{
				heading: 'Agents on a laptop need walls',
				blocks: [
					{
						type: 'p',
						text: 'Microsoft says Copilot can now read local files with permission and take actions on the machine, and that Microsoft Execution Containers will contain what agents are allowed to do. That is the right instinct. An agent with access to your files is a program that follows instructions from text it reads, and some of that text will be hostile.',
					},
					{
						type: 'p',
						text: 'Whatever platform you build on, give each tool the least access it needs, validate every argument in code, and require confirmation for anything that changes something. The same discipline applies to cloud agents, as in [An AI Booking Assistant That Cannot Double Book](/blog/ai-booking-assistant-tool-calling/).',
					},
				],
			},
			{
				heading: 'What I would do this week',
				blocks: [
					{
						type: 'list',
						items: [
							'Run the memory math for the models you actually want to use, with your real context length.',
							'Put local and cloud behind one function so you can move requests either way.',
							'Decide which request types must never leave the device.',
							'Look for independent tokens per second numbers before choosing hardware.',
						],
					},
				],
			},
		],
	},

	{
		slug: 'vibe-coding-vs-learning-to-code-freshers',
		draft: false,
		title: 'Vibe Coding vs Learning to Code: Freshers Guide',
		description: 'Should you still learn to code in 2026? What vibe coding gets wrong, what AI cannot do, and a 90 day roadmap for freshers in Pakistan and beyond.',
		published: '2026-10-06',
		updated: '2026-10-06',
		project: null,
		tags: ['Vibe coding', 'Learn to code in 2026', 'AI for beginners', 'Software engineering careers', 'Freshers'],
		answer:
			'Yes, you should still learn to code in 2026, but learn it differently. Use AI as a fast pair and a patient tutor, and keep the judgment for yourself. Typing code is now cheap, so the skills that pay are reading code, debugging, testing and thinking about how a system fails. Learn the fundamentals by hand first, then build real projects with AI and be able to explain every line you ship.',
		sections: [
			{
				heading: 'Should you still learn to code in 2026?',
				blocks: [
					{
						type: 'p',
						text: 'Yes. But the thing worth learning has changed, and most advice you will find is still describing the old version.',
					},
					{
						type: 'p',
						text: 'Five years ago learning to code meant memorising syntax and grinding exercises until your fingers knew the shapes. That part is now mostly handled by tools. What is not handled is deciding what to build, breaking a vague problem into small ones, noticing that generated code is wrong, finding out why something broke, and designing so it keeps working when real people use it. Those are the skills that were always the real job. They used to be hidden behind the typing, and now they are in plain view.',
					},
					{
						type: 'p',
						text: 'So the question for a fresher is not whether to learn to code. It is whether to learn to code the way that builds judgment, and the rest of this guide is about how.',
					},
				],
			},
			{
				heading: 'What is vibe coding, and why does it break?',
				blocks: [
					{
						type: 'p',
						text: 'Vibe coding is building software by describing what you want to an AI, accepting what it gives back, and steering by feel instead of by reading the code. The name was popularised by Andrej Karpathy in early 2025, and it is a genuinely good way to get a prototype on screen in an afternoon.',
					},
					{
						type: 'p',
						text: 'It breaks when the app meets the real world. A demo has one user who behaves. Production has thousands who do not: they double click, lose signal halfway through a payment, paste emoji into a number field and try the URL of someone else’s page. Code you did not read is code you cannot debug, secure or change safely, and when it fails you have nothing to hold on to.',
					},
				],
			},
			{
				heading: 'Four people, one confusion',
				blocks: [
					{
						type: 'p',
						text: 'Talk to enough people who are starting out and you keep hearing four different stories.',
					},
					{
						type: 'list',
						items: [
							'The first person ships apps by prompting and has never written a loop by hand. It works until the first bug the AI cannot fix. Then they are stuck, because they cannot read what is in front of them.',
							'The second person knows the syntax well but has never asked where the data lives, who may see it, or what happens when two requests arrive together. They write correct lines inside a design that falls over.',
							'The third person says AI does everything now, so why learn at all.',
							'The fourth person says AI can write it, but it cannot scale.',
						],
					},
					{
						type: 'p',
						text: 'Each of them holds a piece of the truth and draws the wrong conclusion from it.',
					},
					{
						type: 'p',
						text: 'The third person is right that typing code is no longer the bottleneck. The wrong conclusion is that understanding code stopped mattering. When typing is nearly free, the scarce thing is knowing whether the output is correct, and you cannot judge what you do not understand.',
					},
					{
						type: 'p',
						text: 'The fourth person is half right. A model will write code that scales if you ask for the right design, and code that collapses at 500 users if you do not. It does not know your traffic, your data or your budget. You do. Scale is a set of decisions about data models, indexes, caching and queues, and somebody has to make those decisions and then check them.',
					},
					{
						type: 'p',
						text: 'The second person should be a little worried, kindly. Syntax was always the easy part, and it is exactly the part AI took over. What is left is the part that was being skipped.',
					},
					{
						type: 'p',
						text: 'And the first person has found a great way to build a prototype this afternoon and a risky way to build something other people depend on. Both are true, and you should know which one you are doing.',
					},
				],
			},
			{
				heading: 'Where AI quietly fails',
				blocks: [
					{
						type: 'p',
						text: 'AI is very good at boilerplate, translating between frameworks, explaining unfamiliar code, drafting tests and remembering the name of a thing you forgot. Use it for all of that without guilt.',
					},
					{
						type: 'p',
						text: 'It fails in a handful of repeatable ways, and the failures look like success because the code runs.',
					},
					{
						type: 'list',
						items: [
							'It invents functions and options that do not exist, with total confidence.',
							'It handles the happy path. Empty input, a second click, a slow network and a missing record are somebody else’s problem.',
							'It fixes the symptom. If an error is annoying, it will catch and hide the error instead of finding the cause.',
							'It repeats logic in three places. Change one, and the other two quietly rot.',
							'It leaves security gaps: no ownership checks, secrets in the code, SQL built from strings.',
							'It has no feel for load. A query inside a loop, a list with no limit, a whole file read into memory.',
							'It forgets earlier decisions as a project grows, and contradicts them.',
						],
					},
					{
						type: 'p',
						text: 'Here is what that looks like in practice. Ask for “an endpoint to list posts and one to edit a post” and you can easily get something like this:',
					},
					{
						type: 'code',
						lang: 'js',
						text: `app.get('/posts', async (req, res) => {
  const posts = await db.query('select * from posts')
  res.json(posts.rows)
})

app.put('/posts/:id', async (req, res) => {
  await db.query(
    \`update posts set body = '\${req.body.body}' where id = \${req.params.id}\`
  )
  res.sendStatus(200)
})`,
					},
					{
						type: 'p',
						text: 'It runs, and the demo works. It also has three serious problems. The update builds SQL out of user input, so a crafted body can run any command against your database. Nobody is checked, so any visitor can edit any post by changing the id. And the list returns every row, which is fine with 10 posts and a slow disaster with 10 million.',
					},
					{
						type: 'p',
						text: 'Here is the same thing after someone who knows what to look for has read it:',
					},
					{
						type: 'code',
						lang: 'js',
						text: `import { z } from 'zod'

const EditPost = z.object({ body: z.string().min(1).max(5000) })

app.get('/posts', async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 20, 100)
  const { rows } = await db.query(
    'select id, body, created_at from posts order by id desc limit $1',
    [limit]
  )
  res.json(rows)
})

app.put('/posts/:id', requireLogin, async (req, res) => {
  const { body } = EditPost.parse(req.body)
  const { rowCount } = await db.query(
    'update posts set body = $1 where id = $2 and user_id = $3',
    [body, req.params.id, req.user.id]
  )
  if (!rowCount) return res.sendStatus(404)
  res.sendStatus(204)
})`,
					},
					{
						type: 'p',
						text: 'Look at what changed. Values go in as parameters, never glued into the query. The input is validated before it touches anything. The update only matches a row that belongs to the logged in user, so editing someone else’s post simply finds nothing. The list has a hard upper limit. None of this is clever. All of it is the kind of thing you only add when you have read the first version and asked what could go wrong.',
					},
					{
						type: 'p',
						text: 'You can ask the AI to make these fixes, and it will, once you know to ask. That is the whole point. The skill is in the asking.',
					},
				],
			},
			{
				heading: 'The skills that pay now',
				blocks: [
					{
						type: 'p',
						text: 'If I had to start again today, this is the order I would build skills in.',
					},
					{
						type: 'p',
						text: 'Reading code comes first. You will read far more code than you write, because most of it will be generated or inherited. For any change, ask three things. What does this do? What input would break it? What else does it touch? A reviewer who asks those three questions catches most of what matters.',
					},
					{
						type: 'p',
						text: 'Debugging comes second, and it is a method, not a talent. Reproduce the problem. Shrink it to the smallest case that still fails. Read the error from top to bottom, including the part you want to skip. Form one guess and test it. Change one thing at a time. When you do ask an AI for help, give it the smallest failing case, the exact error text and what you have already tried. “It is not working” gets you a guess. A precise failing case gets you an answer.',
					},
					{
						type: 'p',
						text: 'Systems thinking is the skill that separates people most. For every feature you build, answer these in writing before you code:',
					},
					{
						type: 'list',
						items: [
							'Where does this data live, and who owns it?',
							'Who is allowed to see it, and who is allowed to change it?',
							'What happens if this fails halfway through?',
							'What happens if two people do it at the same moment?',
							'What happens with 100 times the data or traffic?',
							'How will I find out that it broke?',
						],
					},
					{
						type: 'p',
						text: 'Those six questions are most of what people mean by “scale” and “production ready”. They are cheap to ask and very expensive to skip. A model will answer them well if you put them in the prompt, and will not raise them on its own.',
					},
					{
						type: 'p',
						text: 'Testing is how you tell the AI what you mean. A test is a precise statement of what correct looks like. Write the expectations yourself, let the AI make them pass, then read what it wrote. Be careful with tests the AI writes for its own code, because they often confirm its own mistakes. If the expectation came from you, the test means something.',
					},
					{
						type: 'p',
						text: 'Fundamentals sit underneath all of it. Learn one language properly, whether that is JavaScript, TypeScript or Python. Learn how HTTP works, what a database index does, how Git tracks change, and how a browser, a server and a database talk to each other. Learn the data structures you will actually meet, such as maps, lists and queues. None of this is for the sake of tradition. It is what lets you look at generated code and say that it is wrong.',
					},
				],
			},
			{
				heading: 'How to use AI while you are still learning',
				blocks: [
					{
						type: 'p',
						text: 'The danger when you are new is not that AI is bad. It is that it is good enough to let you skip the struggle that builds understanding. These habits keep the benefit and remove the trap.',
					},
					{
						type: 'list',
						items: [
							'Try first. Give a problem twenty honest minutes before you ask. The failed attempt is what makes the answer stick.',
							'Ask for the explanation, then explain it back in your own words. If you cannot, you have not learned it yet.',
							'Never keep a line you cannot explain. Not for a deadline and not for a demo.',
							'Ask for options and tradeoffs instead of an answer. You are learning to choose.',
							'Ask what could go wrong. It is the cheapest code review there is.',
							'Let it review your code after you write it. This direction teaches more than the reverse.',
							'Turn it off while you practise fundamentals. You do not learn to lift by watching someone else do it.',
						],
					},
					{
						type: 'p',
						text: 'Prompts make a difference. Compare these two.',
					},
					{
						type: 'code',
						lang: 'text',
						text: `Weak:
Make a login system.

Stronger:
I am building a login for a Node and Postgres app. I have never done this.
Explain the main design choices (sessions or tokens, how to store passwords)
and the tradeoffs of each. Then show me the smallest safe version, and list
five ways it could be attacked or break in production.`,
					},
					{
						type: 'p',
						text: 'The second one teaches you something even if you throw the code away.',
					},
				],
			},
			{
				heading: 'A 90 day plan',
				blocks: [
					{
						type: 'p',
						text: 'This is a plan for someone who can give a couple of focused hours a day. Stretch it if you have less time, but keep the order.',
					},
					{
						type: 'list',
						items: [
							'Days 1 to 30, by hand. Pick one language and write small things yourself: a command line todo list, a page that fetches data from an API and shows it, a script that reads a CSV file. Learn basic SQL. Use Git every day. AI is allowed only to explain things.',
							'Days 31 to 60, one real app. Build a full stack project with login, a database, create, read, update and delete, and a live deployment. Now use AI as a pair, following the habits above. Keep a short decision log: what you chose and why.',
							'Days 61 to 90, make it survive. Add tests for the core paths. Validate every input. Check ownership on every change. Add pagination and sensible limits. Add logging and proper error handling. Load it with 100,000 rows and fix whatever gets slow. Write down what broke and how you fixed it.',
						],
					},
					{
						type: 'p',
						text: 'The last thirty days are where most of the learning is, and where most people stop. A project that has survived your own attempts to break it is worth more than three that only work in a demo.',
					},
				],
			},
			{
				heading: 'What your portfolio should show',
				blocks: [
					{
						type: 'p',
						text: 'Anyone can generate a good looking app now, so a good looking app proves little. What stands out is evidence of judgment.',
					},
					{
						type: 'list',
						items: [
							'A live link that works, so people can try it in thirty seconds.',
							'Tests that run, and a way to run them with one command.',
							'A README that explains the decisions and, more importantly, what went wrong and how you fixed it.',
							'A commit history that shows the project growing, not one enormous commit.',
							'One part that handles something serious, even in a small way: permissions, money, a background job or a rate limit.',
						],
					},
					{
						type: 'p',
						text: 'In an interview, expect to be asked to open a random file and explain it. Pick the dullest file in your project and make sure you could do that. If you cannot say what you would change at 100 times the traffic, you have found your next thing to learn.',
					},
				],
			},
			{
				heading: 'Habits that keep AI code safe',
				blocks: [
					{
						type: 'p',
						text: 'These apply whether you are a beginner or years in.',
					},
					{
						type: 'list',
						items: [
							'Keep changes small, so every diff is reviewable. Large generated changes are where bugs hide.',
							'Read every diff before you accept it. Decide, do not skim.',
							'Own the architecture. Let AI fill in the parts, but you choose how the parts fit.',
							'Never let it run migrations, deletes or anything involving secrets without you looking first.',
							'Write down decisions. A model has no memory of why you chose something last month, and neither will you.',
							'Run the tests and the linter every time, and trust them over the explanation.',
						],
					},
				],
			},
			{
				heading: 'Will AI replace junior developers?',
				blocks: [
					{
						type: 'p',
						text: 'Nobody can promise you an answer, and you should be suspicious of anyone who does. What can be said honestly is this. The tasks that are easiest to hand to a model are the routine ones: simple endpoints, boilerplate, small bug fixes, first drafts of tests. Those used to be the work that justified hiring a junior, and many teams are asking for more than that now.',
					},
					{
						type: 'p',
						text: 'That sounds bleak, and it is actually a clear instruction. If routine coding is the part that is being absorbed, then do not build your whole identity on routine coding. Build the things that make a model’s output trustworthy: reading, debugging, testing, security thinking and systems thinking. A fresher who can ship a small project and explain every decision in it is much more useful to a team than one who can only prompt.',
					},
				],
			},
			{
				heading: 'What to do tomorrow, depending on who you are',
				blocks: [
					{
						type: 'list',
						items: [
							'If you vibe code: take the app you already built and read it file by file. List every line you cannot explain. That list is your syllabus.',
							'If you know syntax but not systems: pick any feature and answer the six questions in writing before you code. Then write one test that should fail, and make it pass.',
							'If you think there is no point learning: build one small feature twice in a day, once with AI and once by hand. Notice what you understood after each.',
							'If you think AI cannot scale: put 100,000 rows in your database and see which page gets slow. Fix it with an index or pagination. You will have learned more about scale than any article can teach.',
						],
					},
					{
						type: 'p',
						text: 'AI did not remove the need to understand software. It moved the work from typing to judging, and judging is learnable. If you want to see what thinking about failure looks like in real systems, the posts on [rate limits](/blog/llm-rate-limits-bullmq-reschedule/) and [tenant isolation](/blog/rag-tenant-isolation-vector-index/) are written from exactly that angle.',
					},
				],
			},
		],
	},

	{
		slug: 'rag-tenant-isolation-vector-index',
		draft: false,
		title: 'RAG Tenant Isolation Inside the Vector Index',
		description: 'Filtering by user after a vector search quietly breaks privacy and answer quality. Here is how to filter inside the search, and how to test it.',
		published: '2026-10-05',
		updated: '2026-10-05',
		project: 'retrivo-vault',
		tags: ['RAG', 'MongoDB Atlas Vector Search', 'SaaS', 'Security'],
		answer:
			'Put the user filter inside the vector search itself. If you search everything and remove other people’s chunks afterwards, those chunks still use up the slots you asked for, and one forgotten line of code puts a stranger’s document into someone else’s answer.',
		sections: [
			{
				heading: 'The version most apps ship first',
				blocks: [
					{
						type: 'p',
						text: 'The obvious way to build a multi user RAG app is to search the whole collection, take the best matches, and throw away anything that does not belong to the current user. It passes every test you write on your own laptop, because on your laptop there is only you.',
					},
					{
						type: 'p',
						text: 'Now do the arithmetic with real users. Fifty people have uploaded contracts, and every one of those contracts has a termination clause. You ask for the 8 nearest chunks to “how do I terminate early?”. Those 8 chunks are scattered across many users, because that is what “nearest” means. After the filter you keep one or two, or none, and the assistant answers from almost nothing. Nothing crashed, so nothing alerts you. Answers just get worse as you grow.',
					},
					{
						type: 'p',
						text: 'There is a second problem. The only wall between your users is a filter that lives in application code, and application code gets refactored by tired people.',
					},
				],
			},
			{
				heading: 'Put the filter inside the search',
				blocks: [
					{
						type: 'p',
						text: 'In [Retrivo Vault](/work/retrivo-vault/) the userId filter is part of the Atlas Vector Search index definition and runs inside the nearest neighbour search. Vectors that belong to someone else are never candidates, so the search returns the 8 best chunks from your documents because those are the only chunks it looks at.',
					},
					{
						type: 'p',
						text: 'It takes two pieces. The index declares userId as a filter field next to the vector field:',
					},
					{
						type: 'code',
						lang: 'json',
						text: `{
  "fields": [
    { "type": "vector", "path": "embedding", "numDimensions": 768, "similarity": "cosine" },
    { "type": "filter", "path": "userId" }
  ]
}`,
					},
					{
						type: 'p',
						text: 'And the query passes the filter to the same stage that does the searching. numDimensions has to match your embedding model, so 768 here is only an example.',
					},
					{
						type: 'code',
						lang: 'js',
						text: `export async function searchChunks({ userId, queryVector, limit = 8 }) {
  if (!userId) throw new Error('searchChunks needs a userId')
  return chunks
    .aggregate([
      {
        $vectorSearch: {
          index: 'chunks',
          path: 'embedding',
          queryVector,
          numCandidates: limit * 25,
          limit,
          filter: { userId },
        },
      },
      { $project: { text: 1, source: 1, score: { $meta: 'vectorSearchScore' } } },
    ])
    .toArray()
}`,
					},
					{
						type: 'p',
						text: 'Two details matter. The function refuses to run without a userId, so a bug upstream fails loudly instead of searching everyone. And numCandidates is how many nearest neighbours the engine considers before returning the top limit. A larger number improves recall and costs latency, so tune it with your own data rather than copying mine.',
					},
				],
			},
			{
				heading: 'How to prove isolation works',
				blocks: [
					{
						type: 'p',
						text: 'Do not trust this because a blog post said so. Write the test that would catch the failure, and keep it in CI.',
					},
					{
						type: 'list',
						items: [
							'Create two users and upload the same document to both. Identical text gives identical vectors, which is the hardest case for isolation.',
							'Search as user A and assert that every returned chunk has A’s userId. Assert it for B as well.',
							'Give user B one tiny document and search with limit 8. You should get a few results, not eight and not zero. This catches post filtering, which returns fewer results for small accounts.',
							'Call the search function with no userId and assert that it throws.',
						],
					},
				],
			},
			{
				heading: 'Chunking that survives messy uploads',
				blocks: [
					{
						type: 'p',
						text: 'People upload scanned contracts, CSV files with one enormous line, and pages with no paragraph breaks. A splitter that only cuts on blank lines hands you one giant chunk and useless retrieval, so Retrivo Vault splits in three tiers: paragraphs first, then sentences, then a fixed width cut as the last resort. Chunks overlap by 150 characters, so a fact that sits on a boundary still appears whole in at least one chunk.',
					},
					{
						type: 'p',
						text: 'Here is a sketch of the idea. The real thing also packs small pieces together up to the size limit, but the fallback order is the part worth copying.',
					},
					{
						type: 'code',
						lang: 'js',
						text: `const MAX = 1000
const OVERLAP = 150

export function split(text) {
  const out = []
  for (const paragraph of text.split(/\\n{2,}/)) {
    if (paragraph.length <= MAX) { out.push(paragraph); continue }
    for (const sentence of paragraph.split(/(?<=[.!?])\\s+/)) {
      if (sentence.length <= MAX) { out.push(sentence); continue }
      for (let i = 0; i < sentence.length; i += MAX - OVERLAP) {
        out.push(sentence.slice(i, i + MAX))
      }
    }
  }
  return out.filter((piece) => piece.trim())
}`,
					},
				],
			},
			{
				heading: 'Let the assistant say it does not know',
				blocks: [
					{
						type: 'p',
						text: 'Answers come only from retrieved passages. Every citation shows the exact passage and its match score, and when the answer is not in your documents the assistant says exactly that. A user who has seen it admit ignorance once will believe it the next time it sounds sure. A confident wrong answer costs more trust than ten honest ones earn.',
					},
				],
			},
			{
				heading: 'The same idea shows up in tokens',
				blocks: [
					{
						type: 'p',
						text: 'Refresh tokens follow the same rule. They are issued in families and each rotation is stamped. If an old token turns up again within 15 seconds it is treated as a client retry. Anything older revokes the whole family, because by then someone else probably has a copy. Clients misbehave, so the safe outcome has to be the default one.',
					},
					{
						type: 'p',
						text: 'The rest of the engineering notes, and the 142 tests behind them, are in the [Retrivo Vault case study](/work/retrivo-vault/).',
					},
				],
			},
		],
	},

	{
		slug: 'ai-booking-assistant-tool-calling',
		draft: false,
		title: 'An AI Booking Assistant That Cannot Double Book',
		description: 'How Aria books, reschedules and cancels through LLM tool calling without owning any booking logic, and how to protect a public endpoint.',
		published: '2026-10-04',
		updated: '2026-10-04',
		project: 'aria',
		tags: ['LLM tool calling', 'NestJS', 'AI agents', 'Security'],
		answer:
			'Do not teach the model your booking rules. Give it tools that call the same services your own booking page already calls, validate every argument in code, and gate every change behind a confirmation the model cannot fake. The assistant then cannot disagree with the product because it has no logic of its own.',
		sections: [
			{
				heading: 'Where chatbots go wrong',
				blocks: [
					{
						type: 'p',
						text: 'The tempting version of an AI booking assistant puts the rules in the prompt: opening hours, how long a haircut takes, which staff member does which service. It demos beautifully. Then the business changes a rule in the real booking system, nobody updates the prompt, and the assistant keeps offering slots that do not exist.',
					},
					{
						type: 'p',
						text: 'Any time two places know the same rule, they will eventually disagree. With a chatbot the disagreement ends in a customer standing at a closed door.',
					},
				],
			},
			{
				heading: 'The model chooses, the product decides',
				blocks: [
					{
						type: 'p',
						text: 'Aria is the conversational layer on top of Prime Coworking’s booking product. Customers write things like “need an appointment tomorrow after 5” in any language. Aria owns no availability or booking logic at all. It has 15 tools, and each one wraps the exact domain service that the product’s own booking widget already calls.',
					},
					{
						type: 'p',
						text: 'The model’s whole job is to work out what the customer wants and pick the right tool with the right arguments. What counts as an open slot is decided by the booking engine, the same way for a chat customer and a widget customer. They cannot drift apart because there is only one copy.',
					},
					{
						type: 'code',
						lang: 'ts',
						text: `// A tool is a thin, validated wrapper. It contains no booking rules.
const findSlots = {
  name: 'find_open_slots',
  description: 'List real open appointment slots for a service on a given date.',
  parameters: z.object({
    serviceId: z.string(),
    staffId: z.string().optional(),
    date: z.string().regex(/^\\d{4}-\\d{2}-\\d{2}$/),
  }),
  async run(args, ctx) {
    const input = this.parameters.parse(args)
    return bookingService.getAvailability(ctx.tenantId, input)
  },
}`,
					},
					{
						type: 'p',
						text: 'The parse call is doing real work. Models produce arguments that look right and are not: a date in the wrong format, a service id invented from a name. Validate on the way in, and return an error message the model can read, so it can correct itself and try again.',
					},
				],
			},
			{
				heading: 'A public endpoint still needs teeth',
				blocks: [
					{
						type: 'p',
						text: 'The booking API behind a customer chat is unauthenticated by design, because customers are not logged in. That means a stranger can talk to it, and a stranger can try to talk it into cancelling someone else’s appointment.',
					},
					{
						type: 'p',
						text: 'So every change to a booking is gated behind an emailed one time code, with a name and phone match as a fallback. Requests are rate limited per IP, the flow locks after repeated bad attempts, and every mutation is written to an audit log. The system prompt also has an integrity block, but treat that as a courtesy to the model and not as security. The code enforces the rules even if the model is talked out of them.',
					},
					{
						type: 'p',
						text: 'The question to ask of any tool that changes something is: if the model were completely compromised, what is the worst call it could make, and does the code stop it?',
					},
				],
			},
			{
				heading: 'Conversation memory has sharp edges',
				blocks: [
					{
						type: 'p',
						text: 'Aria keeps a bounded history of 40 messages in MongoDB. Bounded history is sensible, since long chats cost money and eventually overflow the context window. But there is a trap in how you cut it.',
					},
					{
						type: 'p',
						text: 'A tool call and its result are a pair, and model providers reject a history where a call has no matching result, or where a result appears with no call before it. If you simply slice the last 40 messages, you can cut a pair in half. The same thing happens when a request crashes after the model asked for a tool and before the result was saved. Here is a sketch, using a simple internal format with the roles user, assistant and tool. Aria’s conversation memory has orphan turn protection for exactly this class of problem.',
					},
					{
						type: 'code',
						lang: 'js',
						text: `export function trimHistory(messages, max = 40) {
  let history = messages.slice(-max)

  // Never start in the middle of a pair: drop leading tool results
  // and assistant tool calls until a plain user message begins the history.
  while (history.length && history[0].role !== 'user') history.shift()

  // Never end with a tool call that has no result (a crashed turn).
  const last = history[history.length - 1]
  if (last && last.role === 'assistant' && last.toolCalls?.length) history.pop()

  return history
}`,
					},
				],
			},
			{
				heading: 'Plan for the provider to fail and to change',
				blocks: [
					{
						type: 'p',
						text: 'Model calls fail in boring ways: timeouts, overloaded servers, rate limits. Aria retries up to four times with backoff before giving up politely. And the tool loop never imports a vendor SDK directly. It talks to a small provider interface, so Gemini 2.5 Flash today can be replaced tomorrow by editing one adapter. Prices and models change every few months, and that is not the time to rewrite your agent.',
					},
					{
						type: 'p',
						text: 'The chat widget is a React 19 iframe with a focus trap and abort on unmount, and the server owns the conversation state. The internal product is private, so there is no repository to link, but the [Aria case study](/work/aria/) has the full picture.',
					},
				],
			},
		],
	},

	{
		slug: 'llm-rate-limits-bullmq-reschedule',
		draft: false,
		title: 'Do Not Retry an LLM Rate Limit, Reschedule It',
		description: 'Retrying a daily quota error five times in thirty seconds only burns attempts. How to tell the two kinds of 429 apart and reschedule jobs in BullMQ.',
		published: '2026-10-03',
		updated: '2026-10-03',
		project: 'leadforge-ai',
		tags: ['BullMQ', 'Node.js', 'LLM APIs', 'Queues'],
		answer:
			'A rate limit is not a failure, so do not spend retry attempts on it. Work out which limit you hit, then delay the job until that limit resets. Retrying a daily quota error immediately only fills your dead letter queue while hours of quota remain.',
		sections: [
			{
				heading: 'Two very different 429 errors',
				blocks: [
					{
						type: 'p',
						text: 'LLM providers enforce several limits at once. Requests per minute and tokens per minute reset within a minute. A daily quota resets once a day. Both can come back as the same HTTP status, 429, and that is where the trouble starts.',
					},
					{
						type: 'p',
						text: 'If a job hits the per minute limit, waiting 30 seconds fixes it. If it hits the daily quota, waiting 30 seconds fixes nothing, and neither does waiting an hour. The correct delay depends on which limit tripped, and the status code alone does not tell you. Read the error body, since most providers say which quota was exceeded, and check your provider’s documentation for when each one resets.',
					},
				],
			},
			{
				heading: 'What the default retry does to you',
				blocks: [
					{
						type: 'p',
						text: 'A queue with five attempts and exponential backoff is a reasonable default for network blips. Pointed at a daily quota it is a disaster. In LeadForge AI the default behaviour burned all five retries within about thirty seconds and then dead lettered the job, while hours of quota window still lay ahead. The job was fine. The system had simply given up on it far too early.',
					},
					{
						type: 'p',
						text: 'The fix was a change in how I think about it. A rate limit says “not now”, and a failure says “this did not work”. Only the second deserves a retry attempt.',
					},
				],
			},
			{
				heading: 'Rescheduling in BullMQ',
				blocks: [
					{
						type: 'p',
						text: 'BullMQ has a mechanism for exactly this. Inside the worker you call rateLimit with a delay and then throw RateLimitError. The job goes back to waiting without being counted as a failed attempt.',
					},
					{
						type: 'code',
						lang: 'js',
						text: `import { Worker } from 'bullmq'

const worker = new Worker(
  'enrich-leads',
  async (job) => {
    try {
      return await callModel(job.data)
    } catch (error) {
      const waitMs = cooldownFor(error)
      if (waitMs) {
        await worker.rateLimit(waitMs)
        throw Worker.RateLimitError()
      }
      throw error // real failures still use normal retries
    }
  },
  { connection }
)`,
					},
					{
						type: 'p',
						text: 'Notice that rateLimit applies to the worker’s queue, so every job on it waits, not just the one that failed. That is what you want when the quota is shared by all jobs. If one job is the problem, look at moving that single job to the delayed set instead.',
					},
					{
						type: 'p',
						text: 'The function that matters is cooldownFor. It reads the error and returns how long to wait, or nothing if the error is not a rate limit at all.',
					},
					{
						type: 'code',
						lang: 'js',
						text: `function cooldownFor(error) {
  if (error.status !== 429) return 0

  // Honour the server when it tells you how long to wait.
  const retryAfter = Number(error.headers?.['retry-after'])
  if (retryAfter) return retryAfter * 1000

  // Daily quota: wait until the provider's reset, not a few seconds.
  if (/per day|daily/i.test(error.message)) return msUntilQuotaReset()

  // Per minute limit: a minute is enough.
  return 60_000
}`,
					},
					{
						type: 'p',
						text: 'The message patterns above are examples. Log a few real errors from your provider and match on what they actually say.',
					},
				],
			},
			{
				heading: 'If you have more than one API key',
				blocks: [
					{
						type: 'p',
						text: 'NoteMind uses a pool of Gemini keys, round robin, with a cooldown per key that respects the difference between daily and per minute limits. A key that hit its per minute limit should come back soon. A key that hit its daily limit should sit out until the reset. Here is a minimal version of that idea.',
					},
					{
						type: 'code',
						lang: 'js',
						text: `export class KeyPool {
  constructor(keys) {
    this.slots = keys.map((key) => ({ key, availableAt: 0 }))
    this.cursor = 0
  }

  next(now = Date.now()) {
    for (let i = 0; i < this.slots.length; i++) {
      const index = (this.cursor + i) % this.slots.length
      const slot = this.slots[index]
      if (slot.availableAt <= now) {
        this.cursor = (index + 1) % this.slots.length
        return slot
      }
    }
    return null // every key is cooling down
  }

  cool(slot, ms) {
    slot.availableAt = Date.now() + ms
  }

  earliestAvailable() {
    return Math.min(...this.slots.map((slot) => slot.availableAt))
  }
}`,
					},
					{
						type: 'p',
						text: 'When next returns null you do not fail anything. You pass the gap until earliestAvailable to the queue and reschedule, exactly as before.',
					},
				],
			},
			{
				heading: 'A short checklist',
				blocks: [
					{
						type: 'list',
						items: [
							'Rate limit errors never consume a retry attempt.',
							'The delay comes from the error (retry after header, or which quota was hit), not from a constant.',
							'Real failures, like bad input or a crashed parser, still retry a few times and then land in the dead letter queue.',
							'Every dead lettered job has a reason you can read, so you can tell “gave up” from “was never going to work”.',
						],
					},
					{
						type: 'p',
						text: 'LeadForge AI runs verification, scoring and outreach through BullMQ workers on Redis, and the full design is in the [LeadForge AI case study](/work/leadforge-ai/). NoteMind’s key pool is covered in the [NoteMind case study](/work/notemind/).',
					},
				],
			},
		],
	},

	{
		slug: 'llm-chatbot-pipeline-cost-guardrails',
		draft: false,
		title: 'Put the Model Last: A Cheaper, Safer Chatbot',
		description: 'A public LLM chatbot needs caps, caches, guardrails and fallbacks around the model. The pipeline behind The Copper Larder, and how to build yours.',
		published: '2026-10-02',
		updated: '2026-10-02',
		project: 'copper-larder',
		tags: ['LLM chatbots', 'Next.js', 'Cost control', 'Guardrails'],
		answer:
			'Treat the model as the last stage of your pipeline, not the first. Cheap code should answer what it can, refuse what it must, and cache what repeats. Whatever is left goes to the model, and its reply is checked before anyone sees it.',
		sections: [
			{
				heading: 'Why a public chatbot is a different animal',
				blocks: [
					{
						type: 'p',
						text: 'A chatbot behind a login has known users and a bounded audience. A chatbot on a public website is an open endpoint that costs money every time someone sends a message. People will ask it the same five questions all day, try to make it say something embarrassing, and now and then paste a novel into it.',
					},
					{
						type: 'p',
						text: 'The Copper Larder is a demo front of house host for a British bistro. It answers menu questions, takes callback requests and streams its replies. The interesting part is everything wrapped around the model. The request goes through 8 stages, and only stage 7 costs a token.',
					},
				],
			},
			{
				heading: 'The cheap stages come first',
				blocks: [
					{
						type: 'p',
						text: 'Ahead of the model sit session caps, a handoff for complaints, scripted intercepts and an exact match cache. The cheapest and most certain checks go first.',
					},
					{
						type: 'list',
						items: [
							'Session caps stop one visitor, or one script, from running up the bill.',
							'Complaint handoff means an angry customer reaches a human instead of getting a chirpy paragraph.',
							'Intercepts are plain pattern matches for the questions everyone asks, such as opening hours or whether there is parking. The bistro has about 19 of them. They cost no tokens and give the same correct answer every time.',
							'An exact match cache returns a stored answer when the same normalised question has been answered before.',
						],
					},
					{
						type: 'code',
						lang: 'js',
						text: `const intercepts = [
  { test: /\\b(opening|open)\\s+(hours|times)\\b|\\bwhen are you open\\b/i, answer: () => hoursCard(restaurant) },
  { test: /\\bparking\\b/i, answer: () => infoCard(restaurant.parking) },
]

export function tryIntercept(message) {
  const hit = intercepts.find((rule) => rule.test.test(message))
  return hit ? hit.answer() : null
}

const normalise = (text) => text.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\\s+/g, ' ').trim()`,
					},
					{
						type: 'p',
						text: 'Notice that the answers come from restaurant data and are not typed by hand into the rules. The dish and info cards are built only from typed restaurant data, so they can only show what that data says.',
					},
				],
			},
			{
				heading: 'Remember what the guest told you',
				blocks: [
					{
						type: 'p',
						text: 'If someone says “I’m vegan” in message 2, that must still hold in message 20. Models forget, and long histories get trimmed. The Copper Larder treats it as a conversation wide dietary lock. A sturdy way to build one is to store the constraint in session state, inject it into every turn and filter the menu cards in code, so the model is never trusted to remember a constraint that matters.',
					},
				],
			},
			{
				heading: 'Check the reply before it ships',
				blocks: [
					{
						type: 'p',
						text: 'The model is the one stage that can say anything, so its output is checked. In this bot the important rule is that it must never confirm availability, because it cannot know it. If a reply promises that a table is free, a guardrail catches it, rewrites it with a correction, and, importantly, blocks that reply from entering the cache. A simple version looks like this. A cached mistake is a mistake you serve for free to every future visitor.',
					},
					{
						type: 'code',
						lang: 'js',
						text: `const promisesAvailability = /\\b(we have|there is|i can confirm|you are booked|table is available)\\b/i

export function checkReply(reply) {
  if (promisesAvailability.test(reply)) {
    return {
      reply: reply + '\\n\\nI can’t see live availability, so please leave a callback request and the team will confirm.',
      cacheable: false,
    }
  }
  return { reply, cacheable: true }
}`,
					},
				],
			},
			{
				heading: 'Always have a graceful failure',
				blocks: [
					{
						type: 'p',
						text: 'The model will be down, or rate limited, or the key will be missing in some environment. Every one of those paths returns a warm, on brand message and a callback card, so the visitor can still leave their number. A broken demo is a bad impression. A polite “I’ll have someone call you” is just a slightly different product.',
					},
					{
						type: 'p',
						text: 'Two smaller habits round it out. Replies stream over server sent events, with aria live regions so screen readers announce text as it arrives. And the app stores no raw IP addresses, so there is nothing sensitive to leak. See the [Copper Larder case study](/work/copper-larder/) for the rest.',
					},
				],
			},
		],
	},

	{
		slug: 'integer-money-row-level-security-postgres',
		draft: false,
		title: 'Integer Money and Row Level Security in Postgres',
		description: 'Why money should be an integer, how one database function makes a sale all or nothing, and how row level security keeps shops apart.',
		published: '2026-10-01',
		updated: '2026-10-01',
		project: 'retailflow',
		tags: ['PostgreSQL', 'Supabase', 'Row Level Security', 'SaaS'],
		answer:
			'Store every amount as an integer in the smallest unit, do each sale inside a single database function so it lands completely or not at all, and let row level security decide who can see which shop’s rows. Then the cash drawer, the shelf and the ledger cannot disagree.',
		sections: [
			{
				heading: 'Why money is never a float',
				blocks: [
					{
						type: 'p',
						text: 'Open any JavaScript console and add 0.1 and 0.2. You get 0.30000000000000004. Computers store most decimal fractions as binary approximations, and when you add thousands of them the errors become visible rupees. For a shop that reconciles its cash drawer every night, a drawer that is off by a few paisa is a real problem.',
					},
					{
						type: 'p',
						text: 'RetailFlow, a multi tenant point of sale for South Asian shops, stores every amount as an integer in the smallest unit. Rs 12.50 is 1250 paisa. Addition, subtraction and comparison are then exact, and the drawer reconciles to the paisa before anyone goes home.',
					},
					{
						type: 'code',
						lang: 'sql',
						text: `create table sale_items (
  id          bigint generated always as identity primary key,
  sale_id     bigint not null references sales(id),
  product_id  bigint not null references products(id),
  quantity    integer not null check (quantity > 0),
  unit_price  bigint  not null check (unit_price >= 0),  -- paisa
  line_total  bigint  not null check (line_total >= 0)   -- paisa
);`,
					},
					{
						type: 'p',
						text: 'Rounding has to happen somewhere, for example when a percentage discount or a weighted average cost does not divide evenly. Pick the place and the rule once, write it down, and apply it in one function. The mistake is rounding in five different places.',
					},
				],
			},
			{
				heading: 'One function, one transaction',
				blocks: [
					{
						type: 'p',
						text: 'A sale touches several things at once: stock goes down, money comes in, a ledger entry is written, an invoice number is issued. If your app does these as separate calls, a crash in the middle leaves the shelf and the drawer disagreeing, and nobody can say which is right.',
					},
					{
						type: 'p',
						text: 'In RetailFlow a sale is one database function. This is a simplified sketch of the idea, with helper names of my own. A function in Postgres runs inside a single transaction, so every step happens or none does.',
					},
					{
						type: 'code',
						lang: 'sql',
						text: `create function complete_sale(p_shop uuid, p_items jsonb, p_paid bigint)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  v_sale bigint;
  v_total bigint;
begin
  if not has_permission(p_shop, 'sales.create') then
    raise exception 'not allowed';
  end if;

  select coalesce(sum((i->>'quantity')::int * (i->>'unit_price')::bigint), 0)
    into v_total
    from jsonb_array_elements(p_items) as i;

  insert into sales (shop_id, total, paid, invoice_no)
  values (p_shop, v_total, p_paid, next_invoice_no(p_shop))
  returning id into v_sale;

  -- insert sale_items, decrement stock, write the ledger row here.
  -- Any error rolls back everything above.

  return v_sale;
end;
$$;`,
					},
					{
						type: 'p',
						text: 'Two lines deserve attention. security definer makes the function run with its owner’s rights, which is how it can write tables the caller cannot touch, so the permission check at the top is not optional. And set search_path = public stops a malicious schema from hijacking the names the function uses.',
					},
				],
			},
			{
				heading: 'Tenants isolated by the database',
				blocks: [
					{
						type: 'p',
						text: 'RetailFlow serves many shops from one database. If isolation depends on every query remembering a where shop_id clause, it takes one forgotten clause to show one shop another shop’s customers.',
					},
					{
						type: 'p',
						text: 'Row Level Security moves that rule into Postgres. Once it is enabled on a table, the database adds the policy to every query, whoever wrote the query.',
					},
					{
						type: 'code',
						lang: 'sql',
						text: `alter table sales enable row level security;

create policy "members read their shop's sales"
  on sales for select
  using (shop_id in (select shop_id from shop_members where user_id = auth.uid()));

-- No insert, update or delete policy for clients.
-- Writes go through complete_sale() and friends.`,
					},
					{
						type: 'p',
						text: 'The design in RetailFlow is deliberately strict. Clients get SELECT only policies. There is no client write policy on any financial table, so even a stolen user session cannot edit a ledger directly. Every write goes through a permission checked function like the one above. There are 41 of those functions across 35 tables, and 22 permissions decide what an owner, manager or cashier may call.',
					},
				],
			},
			{
				heading: 'How to test that it holds',
				blocks: [
					{
						type: 'list',
						items: [
							'Create two shops and a user in each. Read sales as each user and assert that neither sees the other’s rows.',
							'Try to insert and update a sale directly as a client. Both should fail.',
							'Call the sale function with a user who lacks the permission and assert that it raises.',
							'Make the function fail halfway on purpose and assert that stock and ledger are unchanged.',
						],
					},
					{
						type: 'p',
						text: 'RetailFlow has 231 tests, 92 migrations and a live demo. The write up of the whole system, including khata credit ledgers and shift reconciliation, is in the [RetailFlow case study](/work/retailflow/).',
					},
				],
			},
		],
	},
]

const includeDrafts = import.meta.env.VITE_INCLUDE_DRAFTS === '1'

// Set by vite.config.js for the whole build, so the server render and the browser always agree on what is live.
const now = typeof __BUILD_TIME__ === 'number' ? __BUILD_TIME__ : Date.now()

// A post goes live once its publish time has passed. Without `publishAt` that is the start of its `published` day in Pakistan time.
const startsAt = (post) => Date.parse(post.publishAt ?? `${post.published}T00:00:00+05:00`)

export const livePosts = () =>
	posts.filter((post) => includeDrafts || (!post.draft && startsAt(post) <= now)).sort((a, b) => b.published.localeCompare(a.published))
