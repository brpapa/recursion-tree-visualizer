import React from 'react'

import { Container } from './styles'
import FunctionForm from '../function-form'
import GraphViewer from '../graph-viewer'
import { AdjList, Args } from '../../types'

// const fakeAdjList: AdjList = {
//   0: [{ v: 1 }, { v: 7 }, { v: 8 }, { v: 2 }, { v: 3 }],
//   1: [{ v: 4 }],
//   2: [{ v: 5 }],
//   3: [{ v: 6 }],
//   4: [{ v: 13 }, { v: 14 }, { v: 15 }],
//   5: [{ v: 16 }, { v: 17 }, { v: 18 }],
//   6: [{ v: 19 }, { v: 20 }, { v: 21 }],
// }

const App = () => {
  const [adjList, setAdjList] = React.useState<AdjList>({})
  const [args, setArgs] = React.useState<Args>({})

  return (
    <Container>
      <FunctionForm
        onSubmit={(adjList, args, result) => {
          // console.log(result) // mostrar no final da animação!
          setAdjList(adjList)
          setArgs(args)
        }}
      />
      <GraphViewer adjList={adjList} args={args} />
    </Container>
  )
}

export default App
