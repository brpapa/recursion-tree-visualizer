import buildRunner from './runner'
import { FunctionData, SupportedLanguages, TreeViewerData } from './types'
import { APIGatewayProxyHandler } from 'aws-lambda'
import debug from 'debug'
import { safeParse, safeStringify } from './utils/safe-json'

const log = debug('handler')

type EventBody = {
  lang: SupportedLanguages
  functionData: FunctionData
  options: { memoize: boolean }
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const body = safeParse(event.body!) as EventBody

  // TODO: runtime body validations
  if (!body)
    return badRequest(
      'Provide a body object containing the encoded json string'
    )

  const supportedLanguages = ['node', 'python']
  if (!supportedLanguages.includes(body.lang))
    return badRequest('Unsupported language')

  if (!body.functionData) return badRequest('Bad function object')

  ///////////////////////////////////////////

  log('Event body: ', body)

  try {
    const run = buildRunner(body.lang, body.options)
    const treeViewerData = await run(body.functionData)

    if (treeViewerData.isError())
      return unprocessableEntity(treeViewerData.value.reason)

    return ok(treeViewerData.value)
  } catch (e) {
    log('Unexpected error: ', e)
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
