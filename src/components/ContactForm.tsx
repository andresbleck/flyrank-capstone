import { useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import FormField from './FormField'
import { submitContactForm } from '../lib/submitContactForm'
import {
  MESSAGE_MAX_LENGTH,
  emptyContactForm,
  validateContactForm,
  validateField,
} from '../lib/validation'
import type { ContactFormErrors, ContactFormValues } from '../lib/validation'

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'

type TouchedFields = Partial<Record<keyof ContactFormValues, boolean>>

export default function ContactForm() {
  const [values, setValues] = useState<ContactFormValues>(emptyContactForm)
  const [errors, setErrors] = useState<ContactFormErrors>({})
  const [touched, setTouched] = useState<TouchedFields>({})
  const [status, setStatus] = useState<SubmitStatus>('idle')
  const formRef = useRef<HTMLFormElement>(null)

  // Solo validamos mientras se escribe si el campo ya se abandonó una vez: así
  // nadie ve "email inválido" al teclear la primera letra.
  const handleChange =
    (field: keyof ContactFormValues) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const nextValues = { ...values, [field]: event.target.value }
      setValues(nextValues)

      if (touched[field]) {
        setErrors((previous) => ({ ...previous, [field]: validateField(field, nextValues) }))
      }
    }

  const handleBlur = (field: keyof ContactFormValues) => () => {
    setTouched((previous) => ({ ...previous, [field]: true }))
    setErrors((previous) => ({ ...previous, [field]: validateField(field, values) }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors = validateContactForm(values)
    setErrors(nextErrors)
    setTouched({ name: true, email: true, message: true })

    const firstInvalidField = (Object.keys(values) as (keyof ContactFormValues)[]).find(
      (field) => nextErrors[field],
    )

    if (firstInvalidField) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalidField}"]`)?.focus()
      return
    }

    setStatus('submitting')

    try {
      await submitContactForm(values)
      setValues(emptyContactForm)
      setErrors({})
      setTouched({})
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  // <output> ya expone role="status": el lector de pantalla anuncia el envío
  // correcto sin necesidad de mover el foco.
  if (status === 'success') {
    return (
      <output className="block rounded-xl border border-emerald-300 bg-emerald-50 p-6 text-center dark:border-emerald-800 dark:bg-emerald-950">
        <h2 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
          ¡Mensaje enviado!
        </h2>
        <p className="mt-1 text-sm text-emerald-800 dark:text-emerald-200">
          Gracias por escribir. Te respondo en menos de 24 horas.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-4 rounded-lg border border-emerald-700 px-4 py-2 text-sm font-medium text-emerald-900 transition hover:bg-emerald-100 focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 focus-visible:outline-none dark:border-emerald-400 dark:text-emerald-100 dark:ring-offset-emerald-950 dark:hover:bg-emerald-900"
        >
          Enviar otro mensaje
        </button>
      </output>
    )
  }

  const isSubmitting = status === 'submitting'

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      aria-busy={isSubmitting}
      className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <FormField label="Nombre" error={touched.name ? errors.name : undefined}>
        {(control) => (
          <input
            {...control}
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Ana García"
            value={values.name}
            onChange={handleChange('name')}
            onBlur={handleBlur('name')}
            disabled={isSubmitting}
          />
        )}
      </FormField>

      <FormField label="Email" error={touched.email ? errors.email : undefined}>
        {(control) => (
          <input
            {...control}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="ana@empresa.com"
            value={values.email}
            onChange={handleChange('email')}
            onBlur={handleBlur('email')}
            disabled={isSubmitting}
          />
        )}
      </FormField>

      <FormField
        label="Mensaje"
        hint={`${values.message.length}/${MESSAGE_MAX_LENGTH}`}
        error={touched.message ? errors.message : undefined}
      >
        {(control) => (
          <textarea
            {...control}
            name="message"
            rows={5}
            maxLength={MESSAGE_MAX_LENGTH}
            placeholder="Cuéntame sobre tu proyecto…"
            value={values.message}
            onChange={handleChange('message')}
            onBlur={handleBlur('message')}
            disabled={isSubmitting}
            className={`${control.className} resize-y`}
          />
        )}
      </FormField>

      {status === 'error' && (
        <p
          role="alert"
          className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200"
        >
          No pudimos enviar tu mensaje. Inténtalo de nuevo en unos segundos.
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-slate-900 px-4 py-2.5 font-medium text-white transition hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:ring-offset-slate-900 dark:hover:bg-white"
      >
        {isSubmitting ? 'Enviando…' : 'Enviar mensaje'}
      </button>
    </form>
  )
}
