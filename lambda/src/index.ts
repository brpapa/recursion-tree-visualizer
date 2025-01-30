import { APIGatewayProxyHandler } from 'aws-lambda'
import debug from 'debug'
import buildRunner from './runner'
import { safeStringify } from './static/safe-json'
import { validateAPIGatewayProxyEvent } from './validations/event'

const log = debug('app:handler')

export const handler: APIGatewayProxyHandler = async (event) => {
  // handle the preflight request (OPTIONS method withot req body) automatically sent by the browser before making a CORS request (e.g., POST)
  if (event.httpMethod === 'OPTIONS') return ok({})

  const validatedEvent = validateAPIGatewayProxyEvent(event)
  if (validatedEvent.isError()) return badRequest(validatedEvent.value)

  const body = validatedEvent.value

  try {
    const run = buildRunner(body.lang, body.options)
    const treeViewerData = await run(body.functionData)

    if (treeViewerData.isError())
      return unprocessableEntity(treeViewerData.value.reason)

    return ok(treeViewerData.value)
  } catch (e) {
    log('Unexpected error: %O', e)
    return internalServerError('Internal server error')
  }
}

const ok = (body: any) => result(200, body)
const badRequest = (reason: string) => result(400, { reason })
const unprocessableEntity = (reason: string) => result(422, { reason })
const internalServerError = (reason: string) => result(500, { reason })

const result = (statusCode: number, body: Record<string, any>) => ({
  statusCode,
  body: safeStringify(body),
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT,DELETE",
    "Access-Control-Allow-Headers": "Content-Type",
  },
})
