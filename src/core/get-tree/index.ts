import { FunctionData, AdjList, Args } from '../../types'

const MAX_V = 222

// dado uma função recursiva, retorna a lista de adjacências da árvore de recursão
export default function getTree(this: any, fnData: FunctionData, memorize: boolean) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  var fn: Function, _: Function
  // eslint-disable-next-line
  var userFn: Function = eval(parseFunction(fnData))
  const self = this

  let v = 0 // current vertex id
  const args: Args = {}
  const adjList: AdjList = {} // u -w-> v, where w is the result of fn(...args[v])
  const recursionStack: number[] = [] // the current top is parent of current vertex
  const memo: Record<string, any> = {} // { allArgs as string, result }
  const memoVertices: number[] = [] // vértices que foram obtidos da memória

  // wrapper para a fn, a qual é chamada pela função do usuário
  function fnWrapper(...allArgs: any[]) {
    if (v > MAX_V) throw new Error('Too many recursive calls')

    args[v] = allArgs
    adjList[v] = []

    let adj: { v: number; w?: number } = { v }
    if (recursionStack.length > 0) {
      const u = recursionStack[recursionStack.length - 1]
      adjList[u].push(adj)
    }
    recursionStack.push(v)
    v++

    if (memorize && memo[JSON.stringify(allArgs)] !== undefined) {
      adj.w = memo[JSON.stringify(allArgs)]
      recursionStack.pop()
      memoVertices.push(adj.v)
      return adj.w
    }
    const res = userFn.apply(self, allArgs) // call fn

    memo[JSON.stringify(allArgs)] = res
    adj.w = res
    recursionStack.pop()
    return res
  }

  fn = fnWrapper // here's the biggest trick

  let result = NaN
  // eslint-disable-next-line
  const paramsValues = fnData.params.map((param) => eval(param.value))
  if (paramsValues.length > 0) result = fn(...paramsValues)

  return { adjList, args, result, memoVertices}
}

const parseFunction = (fnData: FunctionData) => {
  const vars = fnData.variables
    ?.map((param) => `${param.name} = ${param.value}`)
    .join(', ')
  const varsDeclaration = (vars && `var ${vars};`) || ''

  const paramsNames = fnData.params.map((param) => param.name).join(', ')

  const fnDeclaration = `_ = function (${paramsNames}) {
    ${varsDeclaration}
    ${fnData.body}
  }`

  return fnDeclaration
}