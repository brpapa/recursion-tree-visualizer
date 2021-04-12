import { APIGatewayProxyEvent } from 'aws-lambda'
import joi from 'joi'
import { supportedLanguages } from '../settings'
import { EventBody } from '../types'
import { Either, error, success } from '../utils/either'
import { isJson, safeParse } from '../utils/safe-json'

/** Runtime valition of the event object received by API Gateway Proxy, returning the parsed event body */
export const validateAPIGatewayProxyEvent = (
  event: APIGatewayProxyEvent
): Either<string, EventBody> => {
  const eventSchema = joi
    .object({
      body: joi
        .string()
        .custom((value) => {
          if (!isJson(value))
            throw new Error('it should be an encoded json string')
          return value
        })
        .required(),
    })
    .unknown(true)
    .required()
  const validatedEvent = eventSchema.validate(event)
  if (validatedEvent.error) return error(validatedEvent.error.message)

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

  const validatedEventBody = eventBodySchema.validate(eventBody)
  if (validatedEventBody.error) return error(validatedEventBody.error.message)

  return success(validatedEventBody.value as EventBody)
}
