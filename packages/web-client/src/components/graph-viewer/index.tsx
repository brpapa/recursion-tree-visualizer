import React from 'react'

import * as s from './styles'
import Graph from './graph'
import ProgressBar from './progress-bar'
import LogBar from './log-bar'
import useInterval from '../../hooks/use-interval'
import { GraphData } from './../../types'

const DELAY_IN_MS = 200

type Props = {
  graphData: GraphData
}

const GraphViewer = ({ graphData }: Props) => {
  const [isUpdating, setIsUpdating] = React.useState(false)
  const [time, setTime] = React.useState(0)
  const [times, setTimes] = React.useState(1)

  if (time < 0 || time > times)
    throw Error('Invalid state: `time` should never be outside the range from 0 to `times`')

  React.useEffect(() => {
    setTime(0)
    if (graphData !== null) {
      setIsUpdating(true)
      setTimes(graphData.times)
    }
  }, [graphData])

  useInterval(
    () => {
      if (time >= times) setIsUpdating(false)
      setTime((time) =>
        graphData?.options.animate ? Math.min(time + 1, times) : times
      )
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
      {graphData === null ? (
        <s.LogoIcon />
      ) : (
        <>
          <LogBar text={graphData.logs[time]} />
          <Graph
            time={time}
            vertices={graphData.vertices}
            edges={graphData.edges}
            bottomRight={graphData.svgBottomRight}
          />
        </>
      )}
    </s.Container>
  )
}

export default GraphViewer
