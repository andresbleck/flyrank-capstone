import type { ContactFormValues } from './contactSchema'

const SIMULATED_DELAY_MS = 2000

/**
 * Share of requests that fail on purpose, so the error path is reachable from
 * the UI while there is no backend. Set to 0 to always succeed.
 */
const SIMULATED_FAILURE_RATE = 0.2

/**
 * Stand-in for the real API call.
 *
 * `ContactForm` takes this as an injectable prop, so swapping it for `fetch()`
 * later touches this file only — and tests never wait 2 real seconds.
 */
export async function submitContactForm(values: ContactFormValues): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS))

  if (Math.random() < SIMULATED_FAILURE_RATE) {
    throw new Error('No pudimos enviar tu mensaje. Por favor, intentá de nuevo.')
  }

  // Stands in for the request body until a real endpoint exists.
  console.info('Contact form submitted:', values)
}
