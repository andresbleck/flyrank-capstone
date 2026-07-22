import { cn } from '../../lib/cn'

/**
 * Shared visual language for text-like controls, so an `<input>` and a
 * `<textarea>` can never drift apart.
 */
export function controlClassName(hasError: boolean, className?: string): string {
  return cn(
    'w-full rounded-md border bg-white px-3 py-2 text-slate-900 shadow-sm transition-colors',
    'placeholder:text-slate-400',
    // Visible focus ring for keyboard users, on top of the browser default.
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
    'disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500',
    hasError
      ? 'border-red-600 focus-visible:ring-red-600'
      : 'border-slate-300 focus-visible:ring-sky-600',
    className,
  )
}
