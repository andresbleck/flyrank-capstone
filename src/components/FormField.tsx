import { useId } from 'react'
import type { ReactNode } from 'react'

export type FieldControlProps = {
  id: string
  className: string
  'aria-invalid': boolean
  'aria-describedby': string | undefined
}

type FormFieldProps = {
  label: string
  /** Texto de ayuda permanente (por ejemplo, un contador de caracteres). */
  hint?: string
  /** Mensaje de error; si existe, el campo se marca como inválido. */
  error?: string
  /** Recibe los props ya cableados (id + ARIA) y devuelve el control. */
  children: (control: FieldControlProps) => ReactNode
}

const CONTROL_CLASSES =
  'w-full rounded-lg border bg-white px-3 py-2 text-slate-900 shadow-xs transition ' +
  'outline-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-offset-2 ' +
  'disabled:cursor-not-allowed disabled:opacity-60 ' +
  'dark:bg-slate-900 dark:text-slate-100 dark:ring-offset-slate-950'

const VALID_CLASSES =
  'border-slate-300 focus-visible:border-slate-900 focus-visible:ring-slate-900 ' +
  'dark:border-slate-700 dark:focus-visible:border-slate-300 dark:focus-visible:ring-slate-300'

const INVALID_CLASSES =
  'border-red-500 focus-visible:border-red-600 focus-visible:ring-red-600 dark:border-red-500'

/**
 * Envoltorio accesible para un campo de formulario: se encarga de la etiqueta,
 * la ayuda, el error y del cableado ARIA entre los tres.
 *
 * Recibe el control como render prop en lugar de renderizar un `<input>` o un
 * `<textarea>` según una bandera: así sirve para cualquier control (input,
 * textarea, select) sin uniones de tipos ni props duplicados, y quien lo usa
 * conserva el tipado nativo del elemento.
 */
export default function FormField({ label, hint, error, children }: FormFieldProps) {
  const id = useId()
  const controlId = `${id}-control`
  const hintId = `${id}-hint`
  const errorId = `${id}-error`

  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ')

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <label htmlFor={controlId} className="text-sm font-medium">
          {label}
        </label>
        {hint && (
          <span id={hintId} className="text-xs text-slate-500 dark:text-slate-400">
            {hint}
          </span>
        )}
      </div>

      {children({
        id: controlId,
        className: `${CONTROL_CLASSES} ${error ? INVALID_CLASSES : VALID_CLASSES}`,
        'aria-invalid': Boolean(error),
        'aria-describedby': describedBy || undefined,
      })}

      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}
