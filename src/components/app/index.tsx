import React from 'react'

import { AppContainer } from './styles'
import FunctionForm from '../function-form'
import Graph from '../graph'
import { AdjList } from '../../types'

// /*
// DOING: essa árvore não está sendo bem posicionada
const fakeAdjList: AdjList = [...Array(29)].map(() => [])
fakeAdjList[0].push({ v: 1 }, { v: 2 }, { v: 3 })
fakeAdjList[1].push({ v: 4 }, { v: 5 }, { v: 6 }, { v: 27 }, { v: 28 })
fakeAdjList[2].push({ v: 7 }, { v: 8 }, { v: 9 })
fakeAdjList[3].push({ v: 10 }, { v: 11 }, { v: 12 })
fakeAdjList[4].push({ v: 13 }, { v: 14 }, { v: 15 })
fakeAdjList[5].push({ v: 16 }, { v: 17 }, { v: 18 })
fakeAdjList[6].push({ v: 19 }, { v: 20 }, { v: 21 }, { v: 22 })
fakeAdjList[7].push({ v: 23 }, { v: 24 }, { v: 25 }, { v: 26 })
// */

/*
const fakeAdjList: AdjList = [...Array(5)].map(() => [])
fakeAdjList[0].push({ v: 1 }, { v: 2 }, { v: 3 }, { v: 4 })
*/

const App = () => {
  const [adjList, setAdjList] = React.useState<AdjList>([])
  const [labels, setLabels] = React.useState<string[]>([])

  return (
    <AppContainer>
      <FunctionForm
        onSubmit={(adjList, args) => {
          setAdjList(adjList)
          setLabels(args.map((arg) => arg.join(',')))
        }}
      />
      <Graph adjList={fakeAdjList} />
      {/* <Graph adjList={fakeAdjList} labels={['0', '-1', '22', '333', '4444']} /> */}
      {/* <Graph adjList={adjList} labels={labels} /> */}
    </AppContainer>
  )
}

export default App
