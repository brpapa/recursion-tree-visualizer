import RunnerFacade from './runner'
import { FunctionData, SupportedLanguages } from './types'
import { APIGatewayProxyHandler, APIGatewayProxyResult, Handler } from 'aws-lambda'
import debug from 'debug'

const log = debug('handler')

type Body = {
  lang: SupportedLanguages
  functionData: FunctionData
  options: { memoize: boolean }
}

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log(event)
  const body = JSON.parse(event.body!) as Body
  
  // request validations
  const supportedLanguages = ['node', 'python']
  if (!supportedLanguages.includes(body.lang))
    return { statusCode: 400, body: 'Unsupported language' }

  if (!body.functionData) return { statusCode: 400, body: 'Bad request' }

  ///////////////////////////////////////////

  try {
    const runner = new RunnerFacade(body.lang as SupportedLanguages)
    const treeViewerDataOrError = await runner.run(body.functionData)

    if (treeViewerDataOrError.isError()) {
      log('error', treeViewerDataOrError.value)
      // TODO: mapear erros
      // return res.status(422).json(treeViewerDataOrError.value)
    }

    return {
      statusCode: 200,
      body: JSON.stringify(treeViewerDataOrError.value),
    }
  } catch (e) {
    // visible on production
    console.log('Unexpected error:', e)
    return { statusCode: 500, body: JSON.stringify(e) }
    // return { statusCode: 500, body: 'Internal server error' }
  }
}

/*
import { FunctionData, TreeViewerData } from '../types'
import getData from './graph'
import getTree from './tree'

type Options = {
  memorize: boolean
  animate: boolean
}

export default function getTreeViewerData(
  fnData: FunctionData,
  options?: Options
): TreeViewerData {
  const memorize = options?.memorize || false
  const animate = options?.animate || true

  const tree = getTree(fnData, memorize)
  const { adjList, args, result, memoVertices } = tree

  if (Object.keys(adjList).length === 0 || result === null) return null

  const data = getData(adjList, args, result, memoVertices)
  return { ...data, options: { animate } }
}
*/
