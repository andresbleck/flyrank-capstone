# Deployment Checklist — Cúspide Gym

**Platform:** Vercel (auto-deploy from `main`)
**Production URL:** https://flyrank-capstone-two.vercel.app/

## Pre-deploy
- [x] `npm run build` passes with no errors
- [x] All tests green (169 passing, ~95% coverage)
- [x] `tsc` and `eslint` clean
- [x] Environment variables set in Vercel (`GROQ_API_KEY`)
- [x] `.env.local` is gitignored — no secrets committed to the repo
- [x] AI route validates input server-side (rejects oversized / malformed / abusive requests)

## Post-deploy verification
- [x] Production URL loads
- [x] AI Coach responds in production
- [x] Contact page renders and info is correct
- [x] Tested on mobile
- [x] Keyboard navigation works (skip link, focus ring, chat focus retained)

## Failure handling
- AI Coach errors show a visible error banner with a retry action (`error.tsx` + chat error state)
- `calculateMacros` validates inputs and throws a clear error on bad data
- Malformed / abusive API requests return `400` without calling the model

## Rollback plan
- Vercel keeps every deployment. To roll back: Vercel dashboard → Deployments →
  select last known-good → "Promote to Production". Or revert the commit on
  `main` and let auto-deploy redeploy.

## Known limitations (see README)
- No request-rate limiting (input caps only) — documented as future work
- `/ai-coach` Lighthouse performance ~58 (AI SDK hydration cost) — documented trade-off

---
Signed off: Andres — 15/09/2026