import { describe, it, expect } from '@jest/globals'
import { validateChildProcessStdout } from '../../src/validations/stdout'
import { debug } from 'debug'
const log = debug('test:validations:stdout')

const rawStdout =
  '{"successValue":{"vertices":{"0":{"argsList":[0,12],"adjList":[{"childId":1,"weight":120},{"childId":16,"weight":0}],"memoized":false},"1":{"argsList":[1,12],"adjList":[{"childId":2,"weight":50},{"childId":9,"weight":50}],"memoized":false},"2":{"argsList":[2,12],"adjList":[{"childId":3,"weight":10},{"childId":6,"weight":0}],"memoized":false},"3":{"argsList":[3,12],"adjList":[{"childId":4,"weight":0},{"childId":5,"weight":0}],"memoized":false},"4":{"argsList":[4,12],"adjList":[],"memoized":false},"5":{"argsList":[4,0],"adjList":[],"memoized":false},"6":{"argsList":[3,6],"adjList":[{"childId":7,"weight":0},{"childId":8,"weight":"-Infinity"}],"memoized":false},"7":{"argsList":[4,6],"adjList":[],"memoized":false},"8":{"argsList":[4,-6],"adjList":[],"memoized":false},"9":{"argsList":[2,8],"adjList":[{"childId":10,"weight":0},{"childId":13,"weight":0}],"memoized":false},"10":{"argsList":[3,8],"adjList":[{"childId":11,"weight":0},{"childId":12,"weight":"-Infinity"}],"memoized":false},"11":{"argsList":[4,8],"adjList":[],"memoized":false},"12":{"argsList":[4,-4],"adjList":[],"memoized":false},"13":{"argsList":[3,2],"adjList":[{"childId":14,"weight":0},{"childId":15,"weight":"-Infinity"}],"memoized":false},"14":{"argsList":[4,2],"adjList":[],"memoized":false},"15":{"argsList":[4,-10],"adjList":[],"memoized":false},"16":{"argsList":[1,2],"adjList":[{"childId":17,"weight":0},{"childId":22,"weight":"-Infinity"}],"memoized":false},"17":{"argsList":[2,2],"adjList":[{"childId":18,"weight":0},{"childId":21,"weight":"-Infinity"}],"memoized":false},"18":{"argsList":[3,2],"adjList":[{"childId":19,"weight":0},{"childId":20,"weight":"-Infinity"}],"memoized":false},"19":{"argsList":[4,2],"adjList":[],"memoized":false},"20":{"argsList":[4,-10],"adjList":[],"memoized":false},"21":{"argsList":[3,-4],"adjList":[],"memoized":false},"22":{"argsList":[2,-2],"adjList":[],"memoized":false}},"fnResult":120},"errorValue":null}'

describe('Validating ChildProcessStdout', () => {
  it('Should return success', () => {
    const validated = validateChildProcessStdout(rawStdout)
    expect(validated.isSuccess()).toBeTruthy()
  })
  it('Should return error', () => {
    const validated = validateChildProcessStdout('')
    expect(validated.isError()).toBeTruthy()
  })
})
