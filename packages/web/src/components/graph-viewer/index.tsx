import React from 'react'

import * as s from './styles'
import Graph from './graph'
import ProgressBar from './progress-bar'
import LogBar from './log-bar'
import useInterval from '../../hooks/use-interval'
import { TreeViewerData } from '../../types'

const DELAY_IN_MS = 200

type Props = {
  treeViewerData: TreeViewerData
}

const TreeViewer = ({ treeViewerData }: Props) => {
  const [isUpdating, setIsUpdating] = React.useState(false)
  const [time, setTime] = React.useState(0)
  const [times, setTimes] = React.useState(1)

  if (time < 0 || time > times)
    throw Error('Invalid state: `time` should never be outside the range from 0 to `times`')

  React.useEffect(() => {
    setTime(0)
    if (treeViewerData !== null) {
      setIsUpdating(true)
      setTimes(treeViewerData.times)
    }
  }, [treeViewerData])

  useInterval(
    () => {
      if (time >= times) setIsUpdating(false)
      setTime((time) =>
        treeViewerData?.options.animate ? Math.min(time + 1, times) : times
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
      {treeViewerData === null ? (
        <s.LogoIcon />
      ) : (
        <>
          <LogBar text={treeViewerData.logs[time]} />
          <Graph
            time={time}
            vertices={treeViewerData.vertices}
            edges={treeViewerData.edges}
            bottomRight={treeViewerData.svgBottomRight}
          />
        </>
      )}
    </s.Container>
  )
}

export default TreeViewer
