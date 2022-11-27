import joi from 'joi'
import { ChildProcessStdout } from '../types'
import { safeParse } from '../utils/safe-json'

/** Runtime valition of the stdout received by child process, returning the parsed stdout */
export const validateChildProcessStdout = (
  rawStdout: string
): ChildProcessStdout => {
  const lines = rawStdout.split('\n')
  const json = lines[lines.length-2]
  const parsedStdout = safeParse(json) as ChildProcessStdout

  const stdoutSchema = joi
    .object({
      successValue: joi
        .object({
          vertices: joi
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
                      weight: joi.any(),
                    })
                  )
                  .required(),
                memoized: joi.boolean().required(),
              })
            )
            .required(),
          fnResult: joi.any().required(),
        })
        .allow(null),
      errorValue: joi.number().allow(null),
    })
    .required()
    .or('successValue', 'errorValue')

  const validatedStdout = stdoutSchema.validate(parsedStdout)

  if (validatedStdout.error)
    throw new Error(
      `Error validating the following child process stdout:\n${rawStdout}\nMessage: ${validatedStdout.error.message}`
    )

  return validatedStdout.value as ChildProcessStdout
}
