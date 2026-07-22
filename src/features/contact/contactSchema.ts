import { z } from 'zod'

export const MESSAGE_MAX_LENGTH = 1000

/**
 * Single source of truth for the contact form: it drives both the runtime
 * validation and the `ContactFormValues` type, so the two can't drift.
 *
 * Every field is trimmed before being checked, otherwise a message made of
 * spaces would pass `min()`.
 */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres.')
    .max(60, 'El nombre no puede superar los 60 caracteres.'),

  email: z
    .string()
    .trim()
    .min(1, 'Ingresá tu email.')
    .pipe(z.email('Ingresá un email válido, por ejemplo nombre@dominio.com.')),

  message: z
    .string()
    .trim()
    .min(10, 'El mensaje debe tener al menos 10 caracteres.')
    .max(MESSAGE_MAX_LENGTH, `El mensaje no puede superar los ${MESSAGE_MAX_LENGTH} caracteres.`),
})

export type ContactFormValues = z.infer<typeof contactSchema>
