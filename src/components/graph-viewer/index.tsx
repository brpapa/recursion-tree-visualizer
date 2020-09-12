import React from 'react'

import { Container } from './styles'
import Graph from './graph'
import ProgressBar from './progress-bar'
import LogBar from './log-bar'
import getGraphData from '../../core/get-graph-data'
import useInterval from '../../hooks/use-interval'
import { Point, AdjList, Args, VerticesData, EdgesData } from './../../types'

const DELAY_IN_MS = 200

type Props = {
  adjList: AdjList
  args: Args
  result: number
}

const GraphViewer = ({ adjList, args, result }: Props) => {
  const [time, setTime] = React.useState(0) // 0 <= time <= times
  const [times, setTimes] = React.useState(1)
  const [isUpdating, setIsUpdating] = React.useState(false)

  // graph data
  const [edgesData, setEdgesData] = React.useState<EdgesData>({})
  const [verticesData, setVerticesData] = React.useState<VerticesData>({})
  const [svgBottomRight, setSvgBottomRight] = React.useState<Point>([0, 0])
  const [logs, setLogs] = React.useState<string[]>([])

  // se args for undefined, esse effect é disparado infinitamente. mas WHY?
  React.useEffect(() => {
    setTime(0)
    if (Object.keys(adjList).length === 0) return

    const res = getGraphData(adjList, args, result)
    const { edgesData, verticesData, svgBottomRight, times, logs } = res

    setIsUpdating(true)
    setTimes(times)
    setEdgesData(edgesData)
    setVerticesData(verticesData)
    setSvgBottomRight(svgBottomRight)
    setLogs(logs)
  }, [adjList, args, result])

  useInterval(
    () => {
      if (time >= times) setIsUpdating(false)
      setTime((time) => Math.min(time + 1, times))
    },
    isUpdating ? DELAY_IN_MS : null
  )

  return (
    <Container>
      <ProgressBar
        value={time / times}
        onChange={(value) => {
          setTime(Math.round(value * times))
          setIsUpdating(false)
        }}
        onNext={() => setTime((time) => Math.min(time + 1, times))}
        onPrevious={() => setTime((time) => Math.max(time - 1, 0))}
        onFirst={() => setTime(0)}
        onLast={() => setTime(times)}
      />
      <LogBar text={logs[time]} />
      <Graph
        time={time}
        vertices={verticesData}
        edges={edgesData}
        bottomRight={svgBottomRight}
      />
    </Container>
  )
}

export default GraphViewer
