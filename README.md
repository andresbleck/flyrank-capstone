# FlyRank Capstone — Cúspide Gym

Capstone project for the FlyRank Frontend AI Engineering Internship — a portfolio
demonstrating the ability to turn client ideas into simple, functional, and intuitive
web applications.

Cúspide Gym is a web app for a gym with a built-in AI coach. Instead of a form that
always asks the same questions, the coach has a conversation: it asks only for the
details it's missing, remembers what you already told it, and adapts the plan to your
goal — training, nutrition, or habits.

## Tech Stack

- Next.js (App Router)
- React
- TypeScript

- Tailwind CSS
- Vercel AI SDK
- Groq (Llama 3.3 70B)

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

## Architecture

Three routes:

- `/` — landing page for the gym (hero, pricing, testimonials).
- `/contact` — contact info and a message form.
- `/ai-coach` — the main feature: a conversational AI fitness coach.

The AI Coach is built with the Vercel AI SDK. The chat UI streams the model's
response token by token and handles four states: streaming, ready, awaiting
input, and error. The `calculateMacros` tool (below) is called by the model when
it has enough data to compute exact numbers.

## AI Integration

The AI Coach uses Groq (Llama 3.3 70B, with Llama 3.1 8B Instant as fallback)
through the Vercel AI SDK.

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

## Known accessibility limitations

Two WCAG 2.1 AA contrast issues are known and not yet resolved:

- Orange accent buttons (orange-500 with white text) fall slightly below the
  4.5:1 contrast ratio. Fixing this means shifting button backgrounds to a darker
  orange (orange-700), which affects the brand color across ~7 components.
  Deferred to keep the current visual identity; planned as a follow-up.
- Some 12px muted text (gray-500 on dark backgrounds) is below 4.5:1. Low
  priority, as it's used for secondary metadata only.

All four blocker-level accessibility issues (accessible name on the chat input,
reachable chat log, screen-reader announcement of AI responses, and pausable
testimonials) have been fixed.

## Performance notes

Lighthouse performance scores (mobile, production):
- `/contact` — 85
- `/` — 81
- `/ai-coach` — 58

Accessibility scores 96 across all routes.

The `/ai-coach` route scores lowest on performance (58). Analysis of the
Lighthouse trace shows this is not a network problem — the critical path
resolves in ~570ms — but a client-side JavaScript cost: Total Blocking Time is
~1s and LCP (5.1s) waits on hydration of the AI chat (Vercel AI SDK, streaming
logic, chat state). This is an inherent trade-off of running a conversational
LLM feature client-side. Reducing it further would require code-splitting and
deferring the AI SDK, deprioritized for this scope in favor of accessibility
(96) and test coverage (~95%).

## License

Released under the [MIT License](LICENSE).