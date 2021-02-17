/*
import buildRunner from '.'

describe('TreeViewerData from FunctionData', () => {
  describe('For `node` language', () => {
    const run = buildRunner('node')

    it('Example 1', async () => {
      const treeViewData = await run({
        globalVariables: [],
        params: [{ name: 'n', initialValue: '5' }],
        body: [
          'if (n == 0 || n == 1) return n',
          'return fn(n-1) + fn(n-2)',
        ].join('\n'),
      })
      console.log(treeViewData)
    })
  })
})
*/