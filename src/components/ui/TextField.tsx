import type { ComponentPropsWithRef } from 'react'
import { Field } from './Field'
import { controlClassName } from './controlStyles'

type TextFieldProps = Omit<ComponentPropsWithRef<'input'>, 'aria-invalid' | 'aria-describedby'> & {
  label: string
  error?: string
  hint?: string
}

/** Single-line text input with its label, hint and validation message. */
export function TextField({ label, error, hint, id, className, ...inputProps }: TextFieldProps) {
  return (
    <Field label={label} error={error} hint={hint} id={id}>
      {(control) => (
        <input
          type="text"
          {...inputProps}
          {...control}
          className={controlClassName(Boolean(error), className)}
        />
      )}
    </Field>
  )
}
