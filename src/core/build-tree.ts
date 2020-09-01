import { FunctionData, AdjList } from './../types'

const MAX_V = 1000

// dado uma função recursiva, retorna a lista de adjacências da árvore de recursão
export function buildTree(this: any, fnData: FunctionData) {
  var fn: Function, userFn: Function, _: Function
  const self = this

  // evaluate the fnData into userFn (can throw error)
  const paramsNames = fnData.params.map((param) => param.name).join(', ')
  const variables = fnData.variables
    ?.map((param) => `${param.name} = ${param.value}`)
    .join(', ')

  const fnDeclaration = `_ = function (${paramsNames}) {
    ${variables? `const ${variables};`: ``}
    ${fnData.body}
  }`
  // console.log(fnDeclaration)
  userFn = eval(fnDeclaration)

  /**/

  let V = 0 // curr qty of vertices
  let labels: Record<number, string> = {} // labels[u]: label (params values) of vertex u
  let adjList: AdjList = {} // let w as the result of fn(...args[v])
  let recursionStack: number[] = [] // o vértice do topo é o pai do atual

  // wrapper para a fn, a qual é chamada recursivamente
  function fnWrapper(...allArgs: any[]) {
    let v = V // v = current vertex id
    if (V++ > MAX_V) throw new Error('Too many recursive calls')

    labels[v] = allArgs.join(',')
    adjList[v] = []

    const adj: { v: number; w?: number } = { v }
    if (recursionStack.length > 0) {
      const v_parent = recursionStack[recursionStack.length - 1]
      adjList[v_parent].push(adj)
    }
    recursionStack.push(v)

    // recursive call
    const result = userFn.apply(self, allArgs)

    adj.w = result
    recursionStack.pop()
    return result
  }
  fn = fnWrapper // here's the biggest trick

  const paramsValues = fnData.params.map((param) => eval(param.value))
  if (paramsValues.length > 0)
    fn(...paramsValues)

  return { adjList, labels }
}
