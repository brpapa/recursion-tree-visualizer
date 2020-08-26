import React from 'react'

import { Container } from './styles'
import FunctionForm from '../function-form'
import Graph from '../graph/graph'
import { buildTree } from '../../core/build-tree'
import { AdjList } from '../../types'

const fakeAdjList: AdjList = [...Array(22)].map(() => [])
fakeAdjList[0].push({ v: 1 }, { v: 2 }, { v: 3 })
fakeAdjList[1].push({ v: 4 }, { v: 5 }, { v: 6 })
fakeAdjList[2].push({ v: 7 }, { v: 8 }, { v: 9 })
fakeAdjList[3].push({ v: 10 }, { v: 11 }, { v: 12 })
fakeAdjList[4].push({ v: 13 }, { v: 14 }, { v: 15 })
fakeAdjList[5].push({ v: 16 }, { v: 17 }, { v: 18 })
fakeAdjList[6].push({ v: 19 }, { v: 20 }, { v: 21 })

const App = () => {
  const [adjList, setAdjList] = React.useState<AdjList>([])
  const [labels, setLabels] = React.useState<string[]>([])

  return (
    <Container>
      <FunctionForm
        onSubmit={(fnData) => {
          // console.log(fnData)
          const tree = buildTree(fnData)
          setAdjList(tree.adjList)
          setLabels(tree.args.map((arg) => arg.join(',')))
        }}
      />
      {/* <Graph adjList={fakeAdjList} /> */}
      <Graph adjList={adjList} labels={labels} />
    </Container>
  )
}

export default App
