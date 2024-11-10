import { Error } from './common'

export enum TreeError {
  EmptyTree = 'Empty Tree Error',
  ExceededRecursiveCallsLimit = 'Exceeded Recursive Calls Limit Error',
  ExceededSourceCodeSizeLimit = 'Exceeded Source Code Size Limit Error',
}

export const emptyTreeError = (): Error<TreeError.EmptyTree> => ({
  type: TreeError.EmptyTree,
  reason: 'The recursion tree is empty',
})

export const exceededRecursiveCallsLimitError = (
  recursiveCallsLimit: number
): Error<TreeError.ExceededRecursiveCallsLimit> => ({
  type: TreeError.ExceededRecursiveCallsLimit,
  reason: `The limit of ${recursiveCallsLimit} recursive calls was exceeded`,
})

export const exceededSourceCodeSizeLimitError = (
  sizeLimitBytes: number
): Error<TreeError.ExceededSourceCodeSizeLimit> => ({
  type: TreeError.ExceededSourceCodeSizeLimit,
  reason: `The source code size exceeded the limit of ${sizeLimitBytes} bytes`,
})
