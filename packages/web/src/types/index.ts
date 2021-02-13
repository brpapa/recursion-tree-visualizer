export type Point = [number, number] // [x,y]

export type Themes = 'light' | 'dark'
export type Templates =
  | 'custom'
  | 'fibo'
  | 'ks'
  | 'ss'
  | 'bc'
  | 'cc'
  | 'pow'
  | 'lcs'
  | 'tsp'

export type Variable = { name: string; value: string }

export type FunctionData = {
  name?: string // usado pelos templates
  params: Variable[]
  body: string
  variables?: Variable[] // variáveis que o escopo da função precisa conseguir acessar
}

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

// all that is necessary to render GraphViewer
export type TreeViewerData = {
  times: number
  edges: EdgesData
  vertices: VerticesData
  svgBottomRight: Point
  logs: string[]
  options: {
    animate: boolean
  }
} | null
