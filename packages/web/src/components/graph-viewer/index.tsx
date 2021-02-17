import React from 'react'

import * as s from './styles'
import Graph from './graph'
import ProgressBar from './progress-bar'
import LogBar from './log-bar'
import useInterval from '../../hooks/use-interval'
import { TreeViewerData } from '../../types'

const DELAY_IN_MS = 200

type Props = {
  data: TreeViewerData
  options: { animate?: boolean }
}

const TreeViewer = ({ data, options: { animate = false } }: Props) => {
  const [isUpdating, setIsUpdating] = React.useState(false)
  const [time, setTime] = React.useState(0)
  const [times, setTimes] = React.useState(1)

  if (time < 0 || time > times)
    throw Error(
      'Invalid state: `time` should never be outside the range from 0 to `times`'
    )

  React.useEffect(() => {
    setTime(0)
    if (data !== null) {
      setIsUpdating(true)
      setTimes(data.times)
    }
  }, [data])

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
      {data === null ? (
        <s.LogoIcon />
      ) : (
        <>
          <LogBar text={data.logs[time]} />
          <Graph
            time={time}
            vertices={data.verticesData}
            edges={data.edgesData}
            bottomRight={data.svgBottomRight}
          />
        </>
      )}
    </s.Container>
  )
}

export default TreeViewer
