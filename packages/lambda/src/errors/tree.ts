import { Error } from './common'

export enum TreeError {
  EmptyTree = 'Empty Tree Error',
  ExceededRecursiveCallsLimit = 'Exceeded Recursive Calls Limit Error',
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
