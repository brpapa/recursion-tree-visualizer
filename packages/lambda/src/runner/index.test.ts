import buildRunner from '.'
import { FunctionData } from '../types'

const bc: FunctionData = {
  params: [
    { name: 'n', initialValue: '5' },
    { name: 'k', initialValue: '2' },
  ],
  body: [
    '// given n items, how many different possible subsets of k items can be formed',
    '',
    'if (k == 0 || n == k) return 1',
    'return fn(n-1, k-1) + fn(n-1, k)',
  ].join('\n'),
}

describe('TreeViewerData from FunctionData', () => {
  describe('For `node` language', () => {
    it('The memoize option should works', async () => {
      const noMemoizeResult = await buildRunner('node', { memoize: false })(bc)
      const withMemoizeResult = await buildRunner('node', { memoize: true })(bc)
      expect(noMemoizeResult.isSuccess()).toBeTruthy()
      expect(withMemoizeResult.isSuccess()).toBeTruthy()
      if (noMemoizeResult.isSuccess() && withMemoizeResult.isSuccess())
        expect(noMemoizeResult.value.times > withMemoizeResult.value.times).toBeTruthy()
    })

    // it('Example 2: coin change', async () => {
    //   const treeViewerData = await run({
    //     globalVariables: [{ name: 'coins', value: '[1,3,4,5]' }],
    //     params: [{ name: 'v', initialValue: '5' }],
    //     body: [
    //       'if (v == 0) return 0',
    //       'if (v < 0) return Infinity',
    //       '',
    //       'let ans = Infinity',
    //       'for (const coin of coins)',
    //       '  ans = Math.min(',
    //       '    ans,',
    //       '    1 + fn(v - coin)',
    //       '  )',
    //       'return ans',
    //     ].join('\n'),
    //   })
    //   expect(treeViewerData.isSuccess()).toBeTruthy()
    // })
  })
})
