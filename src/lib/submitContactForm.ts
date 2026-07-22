import type { ContactFormValues } from './validation'

const NETWORK_DELAY_MS = 900

/**
 * Envío simulado: no hay backend todavía. Cuando exista, este archivo es el
 * único punto que hay que cambiar (un `fetch` al endpoint real); el formulario
 * ya trata la promesa como una llamada de red que puede fallar.
 *
 * Para probar el estado de error a mano, usa un email terminado en `@error.test`.
 */
export async function submitContactForm(values: ContactFormValues): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, NETWORK_DELAY_MS))

  if (values.email.trim().toLowerCase().endsWith('@error.test')) {
    throw new Error('El envío falló (simulado).')
  }

  console.info('Mensaje de contacto enviado:', values)
}
