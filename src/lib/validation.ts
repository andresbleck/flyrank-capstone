export type ContactFormValues = {
  name: string
  email: string
  message: string
}

export type ContactFormErrors = Partial<Record<keyof ContactFormValues, string>>

export const MESSAGE_MAX_LENGTH = 1000

const MESSAGE_MIN_LENGTH = 10
const NAME_MIN_LENGTH = 2

// Comprobación deliberadamente laxa: el único validador fiable de un email es
// enviarle un correo. Aquí solo evitamos erratas obvias sin rechazar direcciones
// válidas poco habituales.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const emptyContactForm: ContactFormValues = {
  name: '',
  email: '',
  message: '',
}

export function validateField(
  field: keyof ContactFormValues,
  values: ContactFormValues,
): string | undefined {
  const value = values[field].trim()

  switch (field) {
    case 'name':
      if (!value) return 'Escribe tu nombre.'
      if (value.length < NAME_MIN_LENGTH) return 'El nombre es demasiado corto.'
      return undefined

    case 'email':
      if (!value) return 'Escribe tu email.'
      if (!EMAIL_PATTERN.test(value)) return 'Ese email no parece válido.'
      return undefined

    case 'message':
      if (!value) return 'Escribe tu mensaje.'
      if (value.length < MESSAGE_MIN_LENGTH)
        return `Cuéntame algo más (mínimo ${MESSAGE_MIN_LENGTH} caracteres).`
      if (value.length > MESSAGE_MAX_LENGTH)
        return `El mensaje no puede superar los ${MESSAGE_MAX_LENGTH} caracteres.`
      return undefined
  }
}

export function validateContactForm(values: ContactFormValues): ContactFormErrors {
  const errors: ContactFormErrors = {}

  for (const field of Object.keys(values) as (keyof ContactFormValues)[]) {
    const error = validateField(field, values)
    if (error) errors[field] = error
  }

  return errors
}
