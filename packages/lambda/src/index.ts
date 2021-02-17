import buildRunner from './runner'
import { FunctionData, SupportedLanguages } from './types'
import { APIGatewayProxyHandler } from 'aws-lambda'
import debug from 'debug'

const log = debug('handler')

type EventBody = {
  lang: SupportedLanguages
  functionData: FunctionData
  options?: { memoize?: boolean }
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const body = JSON.parse(event.body!) as EventBody

  // runtime body validations
  if (!body)
    return {
      statusCode: 400,
      body:
        'Bad request. Provide a body object containing the encoded json string',
    }

  const supportedLanguages = ['node', 'python']
  if (!supportedLanguages.includes(body.lang))
    return {
      statusCode: 400,
      body: 'Unsupported language',
    }

  if (!body.functionData)
    return {
      statusCode: 400,
      body: 'Bad functionData object',
    }

  ///////////////////////////////////////////

  try {
    const run = buildRunner(body.lang, body.options)
    const treeViewerData = await run(body.functionData)

    if (treeViewerData.isError())
      return {
        statusCode: 422,

        body: JSON.stringify(treeViewerData.value),
      }

    return {
      statusCode: 200,
      body: JSON.stringify(treeViewerData.value),
    }
  } catch (e) {
    log('Unexpected error: ', e)
    return {
      statusCode: 500,
      body: 'Internal server error',
    }
  }
}
