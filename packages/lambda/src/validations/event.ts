import { APIGatewayProxyEvent } from 'aws-lambda'
import joi from 'joi'
import { supportedLanguages } from '../settings'
import { EventBody } from '../types'
import { Either, error, success } from '../utils/either'
import { isJson, safeParse } from '../utils/safe-json'

export const validateEventDynamically = (
  event: APIGatewayProxyEvent
): Either<string, EventBody> => {
  const eventSchema = joi.object({
    body: joi
      .string()
      .custom((value) => {
        if (!isJson(value))
          throw new Error('it should be an encoded json string')
        return value
      })
      .required(),
  }).unknown(true)
  const eventValidated = eventSchema.validate(event)
  if (eventValidated.error) return error(eventValidated.error.message)

  const eventBody = safeParse(event.body!) as EventBody

  const eventBodySchema = joi
    .object({
      lang: joi
        .string()
        .valid(...supportedLanguages)
        .required(),
      functionData: joi
        .object({
          body: joi.string().required(),
          params: joi.array().items(
            joi.object({
              name: joi.string().required(),
              initialValue: joi.string().required(),
            })
          ),
          globalVariables: joi.array().items(
            joi.object({
              name: joi.string().required(),
              value: joi.string().required(),
            })
          ),
        })
        .required(),
      options: joi.object({
        memoize: joi.bool().default(false),
      }),
    })
    .required()

  const eventBodyValidated = eventBodySchema.validate(eventBody)
  if (eventBodyValidated.error) return error(eventBodyValidated.error.message)

  const body = eventBodyValidated.value as EventBody
  return success(body)
}
