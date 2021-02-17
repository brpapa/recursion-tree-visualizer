import buildRunner from '.'

describe('TreeViewerData from FunctionData', () => {
  describe('For `node` language', () => {
    const run = buildRunner('node')

    it('Example 1: coin change', async () => {
      const treeViewData = await run({
        globalVariables: [{ name: 'coins', value: '[1,3,4,5]' }],
        params: [{ name: 'v', initialValue: '5' }],
        body: [
          'if (v == 0) return 0',
          'if (v < 0) return Infinity',
          '',
          'let ans = Infinity',
          'for (const coin of coins)',
          '  ans = Math.min(',
          '    ans,',
          '    1 + fn(v - coin)',
          '  )',
          'return ans',
        ].join('\n'),
      })
      expect(treeViewData.isSuccess()).toBeTruthy()
    })
  })
})
