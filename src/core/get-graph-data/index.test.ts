import get from '.'
import { objectMap } from './utils'
import { AdjList } from '../../types/index'

/*
    0
   / \
  1   4
 / \
2   3
*/
const adjList: AdjList = {
  0: [{ v: 1 }, { v: 4 }],
  1: [{ v: 2 }, { v: 3 }],
}

/*
Para cada time:
00: 0
01: 0->1
02: 1
03: 1->2
04: 2
05: 2->1
06: 1
07: 1->3
08: 3
09: 3->1
10: 1
11: 1->0
12: 0
13: 0->4
14: 4
15: 4->0
16: 0
*/

describe('get graph data', () => {
  test('should be compute the correct time ranges for vertices and edges', () => {
    const { verticesData, edgesData } = get(adjList, {})

    const verticesDataSteps = objectMap(verticesData, (data) => ({
      times: data.times,
    }))
    const edgesDataSteps = objectMap(edgesData, (data) => ({
      timeRange: data.timeRange,
    }))

    expect(verticesDataSteps).toEqual({
      0: { times: [0, 12, 16] },
      1: { times: [2, 6, 10] },
      2: { times: [4] },
      3: { times: [8] },
      4: { times: [14] },
    })

    expect(edgesDataSteps).toEqual({
      '[0,1]': { timeRange: [1, 10] },
      '[1,0]': { timeRange: [11, Infinity] },
      '[1,2]': { timeRange: [3, 4] },
      '[2,1]': { timeRange: [5, Infinity] },
      '[1,3]': { timeRange: [7, 8] },
      '[3,1]': { timeRange: [9, Infinity] },
      '[0,4]': { timeRange: [13, 14] },
      '[4,0]': { timeRange: [15, Infinity] },
    })
  })
})
