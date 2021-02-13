import RunnerFacade from './runner'
import { SupportedLanguages } from './types'
import { APIGatewayProxyHandler } from 'aws-lambda'

export const handler: APIGatewayProxyHandler = async () => {
  const language: SupportedLanguages = 'node'
  // TODO: definir body
  // console.log(req.body)

  // request validations
  const supportedLanguages = ['node', 'python']
  if (!supportedLanguages.includes(language))
    return { statusCode: 400, body: 'Unsupported language' }

  try {
    const runner = new RunnerFacade(language as SupportedLanguages)
    const treeViewerDataOrError = await runner.run(
      [
        'const arr = [1, 2, 3]',
        '',
        'function _fn(i, s) {',
        '  if (s == 0) return 1',
        '  if (i == arr.length || s < 0) return 0',
        '  return fn(i + 1, s) + fn(i + 1, s - arr[i])',
        '}',
        '',
        'const fnParamsValues = [0,7]',
        'const memoize = true',
      ].join('\n')
    )

    if (treeViewerDataOrError.isError()) {
      // TODO: mapear erros
      // return res.status(422).json(treeViewerDataOrError.value)
    }

    // return res.json(treeViewerDataOrError.value)
  } catch (e) {
    console.log('Unexpected error:', e)
    return { statusCode: 500, body: 'Internal server error' }
  }
  return { statusCode: 402, body: '' }
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
