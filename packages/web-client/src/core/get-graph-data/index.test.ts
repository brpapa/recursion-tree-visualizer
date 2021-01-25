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
const adjList1: AdjList = {
  0: [{ v: 1 }, { v: 4 }],
  1: [{ v: 2 }, { v: 3 }],
}
/*
For each time:
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
  describe('adj list 1', () => {
    const { verticesData, edgesData } = get(adjList1, {})

    test('should be compute the correct times for vertices', () => {
      expect(
        objectMap(verticesData, (data) => ({
          times: data.times,
        }))
      ).toEqual({
        0: { times: [0, 12, 16] },
        1: { times: [2, 6, 10] },
        2: { times: [4] },
        3: { times: [8] },
        4: { times: [14] },
      })
    })
    test('should be compute the correct time ranges for edges', () => {
      expect(
        objectMap(edgesData, (data) => ({
          timeRange: data.timeRange,
        }))
      ).toEqual({
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
})

/* (0) --16--> (1) --16--> (2) --1--> (3) */
// const adjList2: AdjList = {
//   0: [{ v: 1, w: 16 }],
//   1: [{ v: 2, w: 16 }],
//   2: [{ v: 3, w: 1 }]
// }
/* 
For each time:
00: 0
01: 0->1
02: 1
03: 1->2
04: 2
05: 2->3
06: 3
07: 3->2
08: 2
09: 2->1
10: 1
11: 1->0
12: 0
*/
