import type { ComponentPropsWithRef } from 'react'
import { cn } from '../../lib/cn'

type ButtonProps = ComponentPropsWithRef<'button'> & {
  /** Shows a spinner, disables the button and marks it as `aria-busy`. */
  isLoading?: boolean
  /** Replaces the label while `isLoading` is true. */
  loadingLabel?: string
}

export function Button({
  isLoading = false,
  loadingLabel,
  disabled,
  className,
  children,
  type = 'button',
  ...buttonProps
}: ButtonProps) {
  return (
    <button
      type={type}
      {...buttonProps}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5',
        'text-sm font-semibold text-white bg-sky-700 shadow-sm transition-colors',
        'hover:bg-sky-800',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:bg-slate-400',
        className,
      )}
    >
      {isLoading && <Spinner />}
      {isLoading && loadingLabel ? loadingLabel : children}
    </button>
  )
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  )
}
