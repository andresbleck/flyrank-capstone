type ClassValue = string | false | null | undefined

/**
 * Joins conditional class names. Kept in-house instead of pulling in `clsx`:
 * the whole feature is one line and adds no dependency to audit.
 */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ')
}
