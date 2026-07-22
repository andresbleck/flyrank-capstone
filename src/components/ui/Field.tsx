import { useId } from 'react'
import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

/** Props the wrapper hands back to the control so ARIA wiring stays in one place. */
export type FieldControlProps = {
  id: string
  'aria-invalid': true | undefined
  'aria-describedby': string | undefined
}

type FieldProps = {
  label: string
  /** Validation message. Its presence is what marks the control as invalid. */
  error?: string
  /** Optional helper text, announced together with the error. */
  hint?: string
  id?: string
  children: (control: FieldControlProps) => ReactNode
}

/**
 * Layout + accessibility wrapper shared by every form control.
 *
 * It owns the label/error/hint markup and the `id` <-> `aria-describedby`
 * plumbing so each control only has to render itself. Uses a render prop
 * (rather than a polymorphic `as` prop) to keep control typings native.
 */
export function Field({ label, error, hint, id, children }: FieldProps) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const errorId = `${fieldId}-error`
  const hintId = `${fieldId}-hint`

  // `undefined` (not '') so React drops the attribute when there is nothing to point at.
  const describedBy = cn(hint && hintId, error && errorId) || undefined

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={fieldId} className="text-sm font-medium text-slate-800">
        {label}
      </label>

      {hint && (
        <p id={hintId} className="text-xs text-slate-500">
          {hint}
        </p>
      )}

      {children({
        id: fieldId,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': describedBy,
      })}

      {/*
        Reserves no space when empty, but `aria-describedby` already points here,
        so screen readers announce the message as soon as it appears.
      */}
      {error && (
        <p id={errorId} className="text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  )
}
