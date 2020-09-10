import React from 'react'

import { Container } from './styles'
import Graph from './graph'
import ProgressBar from './progress-bar'
import getGraphData from '../../core/get-graph-data'
import useInterval from '../../hooks/use-interval'
import { Point, AdjList, Args, VerticesData, EdgesData } from './../../types'

const DELAY_IN_MS = 200
  
type Props = {
  adjList: AdjList
  args: Args
}

const GraphViewer = ({ adjList, args }: Props) => {
  const [isUpdating, setIsUpdating] = React.useState(false)
  const [currTime, setCurrTime] = React.useState(0) // 0 <= currTime < qtyTimes
  const [qtyTimes, setQtyTimes] = React.useState(1)

  // graph data
  const [edgesData, setEdgesData] = React.useState<EdgesData>({})
  const [verticesData, setVerticesData] = React.useState<VerticesData>({})
  const [svgBottomRight, setSvgBottomRight] = React.useState<Point>([0, 0])

  // se args for undefined, esse effect é disparado infinitamente. mas WHY?
  React.useEffect(() => {
    setCurrTime(0)
    setIsUpdating(true)

    const { edgesData, verticesData, svgBottomRight, qtyTimes } = getGraphData(
      adjList,
      args
    )
    setQtyTimes(qtyTimes)
    setEdgesData(edgesData)
    setVerticesData(verticesData)
    setSvgBottomRight(svgBottomRight)
  }, [adjList, args])

  // execute the callback function while isUpdating and pendingUpdate.current !== null
  useInterval(
    () => {
      if (currTime >= qtyTimes) setIsUpdating(false)
      setCurrTime((prev) => prev + 1)
    },
    isUpdating ? DELAY_IN_MS : null
  )

  return (
    <Container>
      <ProgressBar progress={currTime / qtyTimes} />
      <Graph
        time={currTime}
        bottomRight={svgBottomRight}
        vertices={verticesData}
        edges={edgesData}
      />
    </Container>
  )
}

export default GraphViewer
