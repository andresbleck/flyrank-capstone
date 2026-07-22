import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextField } from '../../components/ui/TextField'
import { TextAreaField } from '../../components/ui/TextAreaField'
import { Button } from '../../components/ui/Button'
import { contactSchema, MESSAGE_MAX_LENGTH } from './contactSchema'
import type { ContactFormValues } from './contactSchema'
import { submitContactForm } from './submitContactForm'

const GENERIC_ERROR = 'No pudimos enviar tu mensaje. Por favor, intentá de nuevo.'

const EMPTY_FORM: ContactFormValues = { name: '', email: '', message: '' }

/** Outcome of the last submission. `idle` means nothing has been sent yet. */
type SubmitStatus =
  | { type: 'idle' }
  | { type: 'success' }
  | { type: 'error'; message: string }

type ContactFormProps = {
  /**
   * Injected so tests (and a future real API) can replace the simulated
   * request without touching the component.
   */
  onSubmit?: (values: ContactFormValues) => Promise<void>
}

export function ContactForm({ onSubmit = submitContactForm }: ContactFormProps) {
  const [status, setStatus] = useState<SubmitStatus>({ type: 'idle' })
  const statusRef = useRef<HTMLDivElement>(null)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: EMPTY_FORM,
    // Validates on blur first, then live while the user fixes the field:
    // no errors shouted before the user finished typing.
    mode: 'onTouched',
  })

  // The submit button is disabled while sending, so focus is lost when it
  // comes back. Moving focus to the result message keeps keyboard and screen
  // reader users on the thread of what just happened.
  useEffect(() => {
    if (status.type !== 'idle') statusRef.current?.focus()
  }, [status])

  const submit = handleSubmit(async (values) => {
    setStatus({ type: 'idle' })
    try {
      await onSubmit(values)
      setStatus({ type: 'success' })
      // Clears the fields but keeps the form on screen, ready for another message.
      reset(EMPTY_FORM)
    } catch (error) {
      // Keeps the typed values so nothing written is lost on a failure.
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : GENERIC_ERROR,
      })
    }
  })

  const messageLength = watch('message').length

  return (
    <form
      noValidate
      onSubmit={submit}
      aria-labelledby="contact-form-title"
      className="flex w-full flex-col gap-5"
    >
      <div>
        <h2 id="contact-form-title" className="text-2xl font-bold text-slate-900">
          Contacto
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Escribinos y te respondemos a la brevedad. Todos los campos son obligatorios.
        </p>
      </div>

      {status.type !== 'idle' && (
        <div
          ref={statusRef}
          tabIndex={-1}
          // `status` is announced politely, `alert` interrupts: a failure is
          // more urgent than a confirmation.
          role={status.type === 'success' ? 'status' : 'alert'}
          className={
            status.type === 'success'
              ? 'rounded-md border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-700'
              : 'rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-700'
          }
        >
          {status.type === 'success'
            ? '¡Gracias! Tu mensaje fue enviado. Podés enviarnos otro cuando quieras.'
            : status.message}
        </div>
      )}

      <TextField
        label="Nombre"
        autoComplete="name"
        placeholder="Tu nombre"
        error={errors.name?.message}
        {...register('name')}
      />

      <TextField
        label="Email"
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="nombre@dominio.com"
        error={errors.email?.message}
        {...register('email')}
      />

      <div>
        <TextAreaField
          label="Mensaje"
          hint="Contanos en qué podemos ayudarte (mínimo 10 caracteres)."
          placeholder="Escribí tu mensaje…"
          maxLength={MESSAGE_MAX_LENGTH}
          error={errors.message?.message}
          {...register('message')}
        />
        {/* Purely visual: the limit is already enforced by the schema. */}
        <p aria-hidden="true" className="mt-1 text-right text-xs text-slate-500">
          {messageLength}/{MESSAGE_MAX_LENGTH}
        </p>
      </div>

      <Button
        type="submit"
        isLoading={isSubmitting}
        loadingLabel="Enviando…"
        className="w-full sm:w-auto sm:self-start"
      >
        Enviar mensaje
      </Button>
    </form>
  )
}
