// The key advantage is that Error and Success classes share the same interface

/**
 * @param E Error object type
 * @param S Success object type
 */
export type Either<E, S> = Error<E, S> | Success<E, S>

export const error = <E, S>(e: E): Either<E, S> => new Error(e)
export const success = <E, S>(s: S): Either<E, S> => new Success<E, S>(s)

class Error<E, S> {
  constructor(public readonly value: E) {}

  isError(): this is Error<E, S> {
    return true
  }

  isSuccess(): this is Success<E, S> {
    return false
  }

  applyOnSuccess<T>(_: (a: S) => T): Either<E, T> {
    return this as any
  }
}

class Success<E, S> {
  constructor(public readonly value: S) {}

  isError(): this is Error<E, S> {
    return false
  }

  isSuccess(): this is Success<E, S> {
    return true
  }

  applyOnSuccess<T>(f: (a: S) => T): Either<E, T> {
    return success(f(this.value))
  }
}
