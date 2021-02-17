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

const headers = {
  'Access-Control-Allow-Origin': '*', // Required for CORS support to work
  'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
  'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
  'Access-Control-Allow-Methods': 'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const body = JSON.parse(event.body!) as EventBody

  // runtime body validations
  if (!body)
    return {
      statusCode: 400,
      headers,
      body:
        'Bad request. Provide a body object containing the encoded json string',
    }

  const supportedLanguages = ['node', 'python']
  if (!supportedLanguages.includes(body.lang))
    return {
      statusCode: 400,
      headers,
      body: 'Unsupported language',
    }

  if (!body.functionData)
    return {
      statusCode: 400,
      headers,
      body: 'Bad functionData object',
    }

  ///////////////////////////////////////////

  try {
    const run = buildRunner(body.lang, body.options)
    const treeViewerData = await run(body.functionData)

    if (treeViewerData.isError())
      return {
        statusCode: 422,
        headers,
        body: JSON.stringify(treeViewerData.value),
      }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(treeViewerData.value),
    }
  } catch (e) {
    log('Unexpected error: ', e)
    return {
      statusCode: 500,
      headers,
      body: 'Internal server error',
    }
  }
}
