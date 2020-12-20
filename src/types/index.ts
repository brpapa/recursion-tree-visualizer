export type TreeNode = {
  id: number // >= 0
  parent: TreeNode | null
  children: TreeNode[]

  x: number
  y: number
  mod: number
  thread?: TreeNode
}

export type Point = [number, number] // [x,y]

export type Templates = 'custom'| 'fibo' | 'ks' | 'ss' | 'bc' | 'cc' | 'pow' | 'lcs' | 'tsp' | 'mcm'
export type Themes = 'light' | 'dark'

export type Variable = { name: string; value: string }
export type FunctionData = {
  name?: string
  params: Variable[]
  body: string
  variables?: Variable[] // variáveis que o escopo da função precisa conseguir acessar
}

// adjList[u]: [{v, w}, ...], sendo u -w-> v
export type AdjList = Record<number, { v: number; w?: number }[]>
// args[u]: array de params values do vértice u
export type Args = Record<number, any[]>

// key: vértice id
export type VerticesData = Record<
  number,
  {
    times: number[] // times em que o vértice é o atual (em ordem crescente)
    coord: Point
    label?: string
    memorized: boolean // vértices foi obtido da memória?
  }
>

// key: JSON.stringify([u,v]), para a aresta u -> v
export type EdgesData = Record<
  string,
  {
    timeRange: [number, number] // intervalo de min/max times em que a aresta deve ser exibida
    label?: string
  }
>
