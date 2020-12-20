import React from 'react'

import * as s from './styles'
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
  result: number | null
  animate: boolean
  memoVertices: number[]
}

const GraphViewer = ({
  adjList,
  args,
  result,
  animate,
  memoVertices,
}: Props) => {
  const [time, setTime] = React.useState(0)
  const [times, setTimes] = React.useState(1)
  const [isUpdating, setIsUpdating] = React.useState(false)

  if (time < 0 || time > times)
    throw Error('`time` should be between 0 and `times`, inclusive')

  // graph data
  const [edgesData, setEdgesData] = React.useState<EdgesData>({})
  const [verticesData, setVerticesData] = React.useState<VerticesData>({})
  const [svgBottomRight, setSvgBottomRight] = React.useState<Point>([0, 0])
  const [logs, setLogs] = React.useState<string[]>([])

  const showBackground = result === null

  // se args for undefined, esse effect é disparado infinitamente. mas WHY?
  React.useEffect(() => {
    setTime(0)
    if (Object.keys(adjList).length === 0) return
    if (result === null) return

    const graphData = getGraphData(adjList, args, result, memoVertices)
    const { edgesData, verticesData, svgBottomRight, times, logs } = graphData

    setIsUpdating(true)
    setTime(0)
    setTimes(times)
    setEdgesData(edgesData)
    setVerticesData(verticesData)
    setSvgBottomRight(svgBottomRight)
    setLogs(logs)
  }, [adjList, args, result, animate, memoVertices])

  useInterval(
    () => {
      if (time >= times) setIsUpdating(false)
      setTime((time) => (animate ? Math.min(time + 1, times) : times))
    },
    isUpdating ? DELAY_IN_MS : null
  )

  return (
    <s.Container>
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
      {logs[time] && <LogBar text={logs[time]} />}
      {showBackground ? (
        <s.LogoIcon />
      ) : (
        <Graph
          time={time}
          vertices={verticesData}
          edges={edgesData}
          bottomRight={svgBottomRight}
        />
      )}
    </s.Container>
  )
}

export default GraphViewer
