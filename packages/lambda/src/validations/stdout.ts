import joi from 'joi'
import { ChildProcessStdout } from '../types'
import { Either, error, success } from '../utils/either'
import { safeParse } from '../utils/safe-json'

/** Runtime valition of the stdout received by child process, returning the parsed stdout */
export const validateChildProcessStdout = (
  rawStdout: string
): Either<string, ChildProcessStdout> => {
  const stdout = safeParse(rawStdout) as ChildProcessStdout

  const verticesSchema = joi
    .object()
    .pattern(
      /^\d+$/,
      joi.object({
        argsList: joi.array().items(joi.any()).required().not(null),
        adjList: joi
          .array()
          .items(
            joi.object({
              childId: joi.number().required(),
              weight: joi.any().not(null), // if null, probably there was an error when parsing a function call result to JSON
            })
          )
          .required(),
        memoized: joi.boolean().required(),
      })
    )
    .required()

  const stdoutSchema = joi
    .object({
      successValue: joi
        .object({
          vertices: verticesSchema,
          fnResult: joi.any().required(),
        })
        .allow(null),
      errorValue: joi.number().allow(null),
    })
    .required()
    .or('successValue', 'errorValue')

  const validatedStdout = stdoutSchema.validate(stdout)
  if (validatedStdout.error) return error(validatedStdout.error.message)

  return success(validatedStdout.value as ChildProcessStdout)
}
