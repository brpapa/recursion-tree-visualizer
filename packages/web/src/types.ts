export type ThemeType = 'light' | 'dark'
export type Language = 'node' | 'python'
export type Template =
  | 'custom'
  | 'fibo'
  | 'ks'
  | 'ss'
  | 'bc'
  | 'cc'
  | 'pow'
  | 'lcs'
  | 'tsp'

/** [x,y] */
export type Point = [number, number]

export type GlobalVar = { name: string; value: string }

export type FunctionData = {
  body: string
  params?: { name: string; initialValue: string }[]
  globalVariables?: { name: string; value: string }[]
}

/** key: vértice id */
export type VerticesData = Record<
  number,
  {
    /** times em que o vértice é o atual (em ordem crescente) */
    times: number[]
    coord: Point
    label?: string
    /** vértice foi obtido da memória? */
    memoized: boolean
  }
>

/** key: JSON.stringify([u,v]), para a aresta u -> v */
export type EdgesData = Record<
  string,
  {
    /** intervalo de min/max times em que a aresta deve ser exibida */
    timeRange: [number, number]
    label?: string
  }
>

/** all that is necessary to render the tree */
export type TreeViewerData = {
  /** amount of time steps */
  times: number
  edgesData: EdgesData
  verticesData: VerticesData
  /** bottom right corner coordinate */
  svgBottomRight: Point
  /** logs[time]: text description for the current time */
  logs: string[]
} | null