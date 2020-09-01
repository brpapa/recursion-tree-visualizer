import React from 'react'

import { AppContainer } from './styles'
import FunctionForm from '../function-form'
import Graph from '../graph'
import { AdjList } from '../../types'

// /*
// FIXME: essa árvore não está sendo bem posicionada
const fakeAdjList: AdjList = {
  0: [{ v: 1 }, { v: 2 }, { v: 3 }],
  1: [{ v: 4 }, { v: 5 }, { v: 6 }, { v: 27 }, { v: 28 }],
  2: [{ v: 7 }, { v: 8 }, { v: 9 }],
  3: [{ v: 10 }, { v: 11 }, { v: 12 }],
  4: [{ v: 13 }, { v: 14 }, { v: 15 }],
  5: [{ v: 16 }, { v: 17 }, { v: 18 }],
  6: [{ v: 19 }, { v: 20 }, { v: 21 }, { v: 22 }],
  7: [{ v: 23 }, { v: 24 }, { v: 25 }, { v: 26 }],
}
// */

const App = () => {
  const [adjList, setAdjList] = React.useState<AdjList>({})
  const [labels, setLabels] = React.useState<Record<number, string>>({})

  return (
    <AppContainer>
      <FunctionForm
        onSubmit={(adjList, labels) => {
          setAdjList(adjList)
          setLabels(labels)
        }}
      />
      {/* <Graph adjList={fakeAdjList} labels={{}} /> */}
      <Graph adjList={adjList} labels={labels} />
    </AppContainer>
  )
}

export default App
