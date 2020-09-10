// FIXME: código do usuário não pode mutar variables globais definidas por ele
import { FunctionData, AdjList, Args } from '../../types'

const MAX_V = 2222

// dado uma função recursiva, retorna a lista de adjacências da árvore de recursão
export default function getTree(this: any, fnData: FunctionData) {
  // eslint-disable-next-line no-unused-vars
  var fn: Function, userFn: Function, _: Function
  const self = this

  // evaluate the fnData into userFn (can throw error)
  const paramsNames = fnData.params.map((param) => param.name).join(', ')

  const variables = fnData.variables
    ?.map((param) => `${param.name} = ${param.value}`)
    .join(', ')
  const variablesDeclaration = (variables && `var ${variables};`) || ''

  const fnDeclaration = `_ = function (${paramsNames}) {
    ${variablesDeclaration}
    ${fnData.body}
  }`
  // console.log(fnDeclaration)
  userFn = eval(fnDeclaration)

  /**/

  let V = 0 // curr qty of vertices
  let args: Args = {} // args[u]: array de params values of vertex u
  let adjList: AdjList = {} // let the weight as the result of fn(...args[v])
  let recursionStack: number[] = [] // o vértice do topo é o pai do atual

  // wrapper para a fn, a qual é chamada recursivamente
  function fnWrapper(...allArgs: any[]) {
    let v = V // v = current vertex id
    if (V++ > MAX_V) throw new Error('Too many recursive calls')

    args[v] = allArgs
    adjList[v] = []

    const adj: { v: number; w?: number } = { v }
    if (recursionStack.length > 0) {
      const vParent = recursionStack[recursionStack.length - 1]
      adjList[vParent].push(adj)
    }
    recursionStack.push(v)

    // recursive call
    const result = userFn.apply(self, allArgs)

    adj.w = result
    recursionStack.pop()
    return result
  }
  fn = fnWrapper // here's the biggest trick

  let result = NaN
  const paramsValues = fnData.params.map((param) => eval(param.value))
  if (paramsValues.length > 0) result = fn(...paramsValues)

  return { adjList, args, result }
}
