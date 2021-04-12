import { SupportedLanguages } from '../../types'
import { debug } from 'debug'
const log = debug('app:runner:source-code')

/**
 * Get the full code string that will be passed via cli argument, so escape char ".
 * The code contains the user-defined code (function, global variables, initial params values and options) and the code responsible for generating the tree from running of the recursive user-defined function. And should outputs to stdout an JSON string.
 */
export default function getSourceCode(
  plainCode: string,
  lang: SupportedLanguages
) {
  return [
    dependenciesCode[lang],
    plainCode,
    recursionTrackerCode[lang]
  ].join('\n\n')
}

const dependenciesCode: Record<SupportedLanguages, string> = {
  node: `
const safeStringify = (obj) => JSON.stringify(obj, replacer)
const safeParse = (text) => JSON.parse(text, reviver)

const replacer = (_key, value) => {
  if (value === Infinity) return 'Infinity'
  if (value === -Infinity) return '-Infinity'
  if (Number.isNaN(value)) return 'NaN'
  return value
}

const reviver = (_key, value) => {
  if (value === 'Infinity') return Infinity
  if (value === '-Infinity') return -Infinity
  if (value === 'NaN') return NaN
  return value
}
`,
  python: `
import json
import math

def safeStringify(o):
  return json.dumps(o, separators=(',', ':'), indent=None).replace(':Infinity', ':\\"Infinity\\"').replace(':-Infinity', ':\\"-Infinity\\"')
`,
}

const recursionTrackerCode: Record<SupportedLanguages, string> = {
  node: `
const MAX_RECURSIVE_CALLS = 222

const vertices = {}

let currId = 0 // current vertex id
const memoizedResults = {} // for each list of args
const stack = [] // the current top is the parent id of the current vertex

let errorValue = null

function fn(...args) {
  if (currId > MAX_RECURSIVE_CALLS) {
    errorValue = MAX_RECURSIVE_CALLS
    return null
  }

  vertices[currId] = {
    argsList: args,
    adjList: [],
    memoized: false
  }

  let adj = { childId: currId, weight: undefined }

  if (stack.length > 0) {
    const parentId = stack[stack.length - 1]
    vertices[parentId].adjList.push(adj)
  }

  stack.push(currId++)

  let previousResult = memoizedResults[safeStringify(args)]
  if (memoize && previousResult !== undefined) {
    adj.weight = previousResult
    stack.pop()
    vertices[adj.childId].memoized = true
    return adj.weight
  }

  const result = _fn(...args)
  adj.weight = result

  stack.pop()
  memoizedResults[safeStringify(args)] = result
  return result
}

const fnResult = fn(...fnParamsValues)

const output = { successValue: null, errorValue: null }
if (errorValue != null)
  output.errorValue = errorValue
else
  output.successValue = { vertices, fnResult: fnResult === undefined? null : fnResult }

console.log(safeStringify(output))
`,
  python: `
MAX_RECURSIVE_CALLS = 222

vertices = {}

currId = 0  # current vertex id
memoizedResults = {}  # for each list of args
stack = []  # the current top is the parent id of the current vertex

errorValue = None

def fn(*args):
  global vertices, currId , memoizedResults, stack, errorValue, memoize

  if (currId > MAX_RECURSIVE_CALLS):
    errorValue = MAX_RECURSIVE_CALLS
    return None

  vertices[currId] = {
    'argsList': list(args),
    'adjList': [],
    'memoized': False
  }

  adj = {'childId': currId, 'weight': None}

  if (len(stack) > 0):
    parentId = stack[-1]
    vertices[parentId]['adjList'].append(adj)

  stack.append(currId)
  currId += 1

  previousResult = memoizedResults.get(safeStringify(list(args)))
  if (memoize and previousResult is not None):
    adj['weight'] = previousResult
    stack.pop()
    vertices[adj['childId']]['memoized'] = True
    return adj['weight']

  result = _fn(*args)
  adj['weight'] = result

  stack.pop()
  memoizedResults[safeStringify(list(args))] = result
  return result

fnResult = fn(*fnParamsValues)

output = { 'successValue': None, 'errorValue': None }
if (errorValue is not None):
  output['errorValue'] = errorValue
else:
  output['successValue'] = { 'vertices': vertices, 'fnResult': fnResult }

print(safeStringify(output))
`,
}
