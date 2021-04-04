import { APIGatewayProxyHandler } from 'aws-lambda'
import debug from 'debug'
import joi from 'joi'
import buildRunner from './runner'
import { FunctionData, SupportedLanguages, TreeViewerData } from './types'
import { safeParse, safeStringify, isJson } from './utils/safe-json'
import { supportedLanguages } from './settings'

const log = debug('app:handler')

type EventBody = {
  lang: SupportedLanguages
  functionData: FunctionData
  options: { memoize: boolean }
}

export const handler: APIGatewayProxyHandler = async (event) => {
  ////////////////////////////////////////////  dynamic object validation

  log('Event received: %O', event)

  const eventSchema = joi.object({
    body: joi.string().custom((value) => {
      if (!isJson(value))
        throw new Error('it should be an encoded json string')
      return value
    }).required()
  })
  const eventValidated = eventSchema.validate(event)
  if (eventValidated.error)
    return badRequest(eventValidated.error.message)
  
  const eventBody = safeParse(event.body!) as EventBody

  const eventBodySchema = joi.object({
    lang: joi.string().valid(...supportedLanguages).required(),
    functionData: joi.object({
      body: joi.string().required(),
      params: joi.array().items(joi.object({
        name: joi.string().required(),
        initialValue: joi.string().required()
      })),
      globalVariables: joi.array().items(joi.object({
        name: joi.string().required(),
        value: joi.string().required()
      }))
    }).required(),
    options: joi.object({
      memoize: joi.bool().required()
    })
  }).required()

  const eventBodyValidated = eventBodySchema.validate(eventBody)
  // eventBody = eventBodyValidated.value

  if (eventBodyValidated.error)
    return badRequest(eventBodyValidated.error.message)

  ///////////////////////////////////////////

  try {
    const run = buildRunner(eventBody.lang, eventBody.options)
    const treeViewerData = await run(eventBody.functionData)

    if (treeViewerData.isError())
      return unprocessableEntity(treeViewerData.value.reason)

    return ok(treeViewerData.value)
  } catch (e) {
    log('Unexpected error: %O', e)
    return internalServerError('Internal server error')
  }
}

const ok = (body: TreeViewerData) => result(200, body)
const badRequest = (reason: string) => result(400, { reason })
const unprocessableEntity = (reason: string) => result(422, { reason })
const internalServerError = (reason: string) => result(500, { reason })

const result = (statusCode: number, body: Record<string, any>) => ({
  statusCode,
  body: safeStringify(body),
})
