import { SupportedLanguages } from 'src/types'

/**
 * Get the full code string that contains the user-defined code (function, global variables, initial params values and options) and the code responsible for generating the tree from running of the recursive user-defined function.
 * Outputs to stdout a JSON string.
 */
export default function getSourceCodeContent(
  userDefinedCode: string,
  lang: SupportedLanguages
) {
  if (lang === 'node')
    return [
      '/* Auto-generated code */',
      '',
      userDefinedCode,
      treeGeneratorCode.node,
    ].join('\n')

  if (lang === 'python')
    return [
      '"""Auto-generated code"""',
      'import json',
      '',
      userDefinedCode,
      treeGeneratorCode.python,
    ].join('\n')

  return ''
}

const treeGeneratorCode = {
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

  let previousResult = memoizedResults[JSON.stringify(args)]

  if (memoize && previousResult !== undefined) {
    adj.weight = previousResult
    stack.pop()
    vertices[adj.childId].memoized = true
    return adj.weight
  }

  const result = _fn(...args)
  adj.weight = result

  stack.pop()
  return previousResult = result
}

/* */

const fnResult = fn(...fnParamsValues)

const output = { successValue: null, errorValue: null }
if (errorValue != null)
  output.errorValue = errorValue
else
  output.successValue = { vertices, fnResult: fnResult === undefined? null : fnResult }

console.log(JSON.stringify(output))
`,
  python: `
MAX_RECURSIVE_CALLS = 222

vertices = {}

currId = 0  # current vertex id
memoizedResults = {}  # for each list of args
stack = []  # the current top is the parent id of the current vertex

errorValue = None

def fn(*args):
    global currId

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

    previousResult = memoizedResults.get(json.dumps(list(args)))

    if (memoize and previousResult != None):
        adj['weight'] = previousResult
        stack.pop()
        vertices[adj.childId]['memoized'] = True
        return adj['weight']

    result = _fn(*args)
    adj['weight'] = result

    stack.pop()
    previousResult = result
    return result

#

fnResult = fn(*fnParamsValues)

output = { 'successValue': None, 'errorValue': None }
if (errorValue is not None):
  output['errorValue'] = errorValue
else:
  output['successValue'] = { 'vertices': vertices, 'fnResult': fnResult }

print(json.dumps(output, separators=(',', ':')))
  `,
}
