// THIS FILE IS SYMLINKED BETWEEN packages/lambda/src/static/types.ts and packages/web/src/static/types.ts, SO ANY CHANGES AFFECTS BOTH

export type FunctionData = {
  body: string
  params?: Param[]
  returnType?: string
  globalVariables?: GlobalVar[]
}

export type Param = {
  name: string
  type?: string
  initialValue: string
}

export type GlobalVar = {
  name: string
  value: string
}