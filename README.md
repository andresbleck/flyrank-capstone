# FlyRank Capstone — FORGE

Capstone project for the FlyRank Frontend AI Engineering Internship — a portfolio
demonstrating the ability to turn client ideas into simple, functional, and intuitive
web applications.

FORGE is a web app for a gym with a built-in AI coach. Instead of a form that
always asks the same questions, the coach has a conversation: it asks only for the
details it's missing, remembers what you already told it, and adapts the plan to your
goal — training, nutrition, or habits.

**Live:** https://flyrank-capstone-two.vercel.app/

## Tech Stack

- Next.js 16 (App Router) + React 19
- TypeScript
- Tailwind CSS v4
- React Hook Form + Zod (forms and server-side request validation)
- Vercel AI SDK + Groq (streaming chat and tool calling)
- Vitest + Testing Library (unit and component tests)
- Playwright (end-to-end)

## Getting Started

**Prerequisites:** Node.js 20.9+

```bash
git clone https://github.com/andresbleck/flyrank-capstone.git
cd flyrank-capstone
npm install
```

### Environment variables

This project needs a Groq API key to run the AI Coach.

```bash
cp .env.example .env.local
```

Then open `.env.local` and add your key:

```
GROQ_API_KEY=your_key_here
```

You can get a free key at https://console.groq.com. Without it, the AI Coach will not respond.

### Run

```bash
npm run dev
```

The app runs at `http://localhost:3000` by default.

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm test` | Unit and component tests (Vitest) |
| `npm run test:e2e` | End-to-end tests (Playwright) |
| `npm run test:e2e:ui` | Playwright in UI mode |

Coverage is available through Vitest directly: `npx vitest run --coverage`.

## Architecture

Four routes:

- `/` — landing page for the gym (hero, pricing, metrics, testimonials).
- `/contact` — contact info, locations, FAQ, and a message form.
- `/ai-coach` — the main feature: a conversational AI fitness coach.
- `/health` — a server-side data fetching check. It renders a live third-party
  response, or a failure message when the request fails. Not linked from the
  navigation; it exists to demonstrate server-component fetching and error handling.

Code is organized by feature: `src/features/<feature>/{components,hooks,lib}`, with
cross-feature primitives in `src/components/ui`. Tests live next to the file they
cover.

The AI Coach is built with the Vercel AI SDK. The chat UI streams the model's
response token by token and handles four states: streaming, ready, awaiting
input, and error. The `calculateMacros` tool (below) is called by the model when
it has enough data to compute exact numbers.

## AI Integration

The AI Coach runs on Groq through the Vercel AI SDK. The current model is
`qwen/qwen3.6-27b`, chosen for its streaming speed. It's a Groq *preview* model, so
the fallback — `openai/gpt-oss-20b` — is documented in
`src/features/ai-coach/constants.ts` along with the provider options each one needs.
Model and prompt configuration live in that single file.

The system prompt makes the model behave like a practical fitness and habits
coach: it asks only for the context it's missing, remembers what the user already
said, and adapts plans to their goal (training, nutrition, or habits). This is
what a static form can't do — it collects context conversationally instead of
asking everything up front. For exact calorie and macro numbers, the prompt
forbids the model from estimating and forces it to call the `calculateMacros`
tool instead.

### AI Tool: calculateMacros

The AI Coach can call this tool to work out someone's daily calories and macros
using the Mifflin-St Jeor formula, instead of having the model guess the numbers
itself.

It takes age, weight (kg), height (cm), sex, activity level (sedentary through
very active), and a goal (lose, maintain, or gain), and returns `bmr`, `tdee`,
`calories`, `protein`, `carbs`, `fat`, plus the goal it calculated for.

Zod checks that the inputs are the right type, but that's not enough on its own —
a negative weight is still a valid number. So `execute` also checks that age is
between 14 and 100 and that weight/height are positive, and throws a clear error
if not.

## Testing

175 tests across 26 files (Vitest + Testing Library), plus one Playwright
end-to-end run covering the primary chat flow. Tests cover happy paths, validation
rules, failure states, and edge cases — including schema boundaries, localStorage
persistence, error banners, and accessibility behaviour like focus movement after
submit.

## Further reading

- [WORKFLOW.md](WORKFLOW.md) — vague prompt vs. detailed prompt: the same contact
  form built twice, and what changed underneath.
- [DEPLOYMENT.md](DEPLOYMENT.md) — deployment checklist, failure handling, and
  rollback plan.

## Known limitations & future improvements

### Accessibility
All four blocker-level accessibility issues (accessible name on the chat input,
reachable chat log, screen-reader announcement of AI responses, and pausable
testimonials) have been fixed. Two lower-severity WCAG 2.1 AA contrast issues
remain:
- Orange accent buttons (orange-500 with white text) fall slightly below the
  4.5:1 contrast ratio. Fixing this means a darker orange (orange-700) across
  ~7 components; deferred to keep the current brand identity.
- Some 12px muted text (gray-500 on dark) is below 4.5:1. Low priority —
  secondary metadata only.

### AI route
- No request-rate limiting. Input is validated and capped server-side (message
  length, message count, allowed roles), which prevents oversized or malformed
  abuse — but a client could still send many valid requests in a loop. Per-user
  rate limiting is the intended next step.
- The full conversation history is re-sent on every turn, so long conversations
  eventually hit Groq's tokens-per-minute limit. A context window (trimming old
  messages) would fix this.
- Plain-text prompt injection ("ignore your instructions" inside a normal user
  message) is not fully mitigated. This is an open problem across the industry,
  not specific to this app; the system prompt is injected server-side and cannot
  be overridden via the request body.

### Performance
- The `/ai-coach` route scores ~58 on Lighthouse mobile performance. The trace
  shows this is not a network issue (critical path ~570ms) but the cost of
  hydrating the AI chat client-side (Total Blocking Time ~1s, LCP 5.1s). This is
  an inherent trade-off of a client-side conversational LLM. Code-splitting and
  deferring the AI SDK would improve it; deprioritized in favor of accessibility
  (96) and test coverage.

### Future improvements
- User authentication, so only signed-in members can use the chat (also enables
  per-user rate limiting).
- Context-window management to stay within token limits on long conversations.
- Darker orange token to close the remaining contrast gaps.
- A shared icon module — SVG icons are currently defined inline in the components
  that use them, and one (Instagram) is duplicated across two files.

## License

Released under the [MIT License](LICENSE).
