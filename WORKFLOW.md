# vague prompt vs detailed prompt

I built the same contact form twice to see how much the prompt changes the result.
- `feature/vague-prompt` — I just asked for "a contact form".
- `feature/detailed-prompt` — I wrote a long prompt: the fields, the states, the
  validation rules, the accessibility I wanted, and that I wanted tests.
Both branches work and look fine. What changed is everything underneath.

## What I notice first

The vague branch has 7 files in `src/` and no extra libraries. All the validation is
written by hand: a `switch` per field, a regex for the email, and four `useState`
hooks to track values, errors, touched fields and submit status. It works, but it is
basically me rewriting a form library by hand.

The detailed branch has 15 files. It uses React Hook Form + Zod, so the rules live
in one schema and the TypeScript type comes from that same schema. It also splits the code: reusable pieces in `components/ui/`, contact-specific code in `features/contact/`.


## Correctness

In the vague branch the type and the validation are two separate things. If I add a
field to the type, nothing tells me I forgot to validate it. In the detailed branch
that cannot happen, because the type is generated from the schema.

I also found a real bug in the vague branch: it validates the trimmed value but sends the untrimmed one. The detailed branch trims in the schema and has a test for it.

## Accessibility

Both do the basics right: labels, `aria-invalid`, `aria-describedby`, `role="alert"`.

The detailed branch goes further. When the request finishes, it moves focus to the
result message, so a keyboard or screen reader user knows what happened. It uses
`role="status"` for success and `role="alert"` for errors, and `aria-busy` on the
button while sending. The vague branch replaces the whole form with a success box and never moves focus, so the focus ends up nowhere.

## Edge cases

The detailed branch covers double clicks (the button is disabled while sending),
failed requests (it keeps what I typed instead of clearing it), retry after a failure, and whitespace-only messages. The vague branch handles the failure state too, but I only know that by reading the code.

To be fair, the vague branch does three things better: it keeps the `oxlint` config
with the `jsx-a11y` plugin, it has full dark mode, and its fake failure is
deterministic instead of random 20% of the time.

## Review effort

This is the biggest difference. The vague branch has 0 tests, so reviewing it means
reading 174 lines of form logic and trusting it. The detailed branch has 18 tests
(296 lines) that describe the expected behaviour, so I can review the intent instead
of the implementation. 

Writing the longer prompt took me a few extra minutes and saved me a lot of guessing later.
