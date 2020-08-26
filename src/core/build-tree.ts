import { FunctionData, AdjList } from './../types'

// dado uma função recursiva, retorna a lista de adjacências da árvore de recursão
export function buildTree(this: any, fnData: FunctionData) {
  var fn: Function, userFn: Function, _: Function
  const self = this

  // evaluate the fnData into userFn
  try {
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
  } catch (error) {
    throw new Error(
      `The user function contains the following ${error.name}: ${error.message}`
    )
  }

  let V = 0 // curr qty of vertices
  let args: any[][] = [] // args[u]: array of params values of vertex u
  let adjList: AdjList = [] // let w as the result of fn(...args[v])
  let recursionStack: number[] = [] // o vértice do topo é o pai do atual

  // wrapper para a fn, a qual é chamada recursivamente
  function fnWrapper(...allArgs: any[]) {
    let v = V // v = current vertex id
    if (V++ > 1000) throw new Error('Too many recursive calls')

    args.push(allArgs) // args[v] = allArgs
    adjList.push([]) // adjList[v] = []

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
  fn(...paramsValues)

  return { adjList, args }
}
