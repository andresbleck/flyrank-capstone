import type { ComponentPropsWithRef } from 'react'
import { Field } from './Field'
import { controlClassName } from './controlStyles'
import { cn } from '../../lib/cn'

type TextAreaFieldProps = Omit<
  ComponentPropsWithRef<'textarea'>,
  'aria-invalid' | 'aria-describedby'
> & {
  label: string
  error?: string
  hint?: string
}

/** Multi-line text input, visually identical to {@link TextField}. */
export function TextAreaField({
  label,
  error,
  hint,
  id,
  className,
  rows = 5,
  ...textAreaProps
}: TextAreaFieldProps) {
  return (
    <Field label={label} error={error} hint={hint} id={id}>
      {(control) => (
        <textarea
          rows={rows}
          {...textAreaProps}
          {...control}
          // Vertical-only resize keeps the layout from breaking on narrow screens.
          className={controlClassName(Boolean(error), cn('resize-y', className))}
        />
      )}
    </Field>
  )
}
