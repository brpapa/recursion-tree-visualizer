/**
 * Used for expected errors, that is, deterministic and meaningful errors that convey the business logic and domain. For unexpected errors, like network or file access failures, throw exceptions.
 */
export interface Error<T> {
  type: T
  reason: string
}
