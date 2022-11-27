import { FunctionData, SupportedLanguages } from '../../types'

/**
 * Get the full code string that will be passed via cli argument, so escape char ".
 * The code contains the user-defined code (function, global variables, initial params values and options) and the code responsible for generating the tree from running of the recursive user-defined function. And should outputs to stdout an JSON string.
 */
export function toSourceCode(
  fnData: FunctionData,
  lang: SupportedLanguages,
  maxRecursiveCalls: number,
  memoize: boolean
) {
  const codegen = codegenFactory(fnData, maxRecursiveCalls)[lang]
  const userCode = toUserCode(fnData, lang, memoize)

  if (lang === 'golang') {
    if (fnData.returnType === undefined) 
      throw new Error('For `golang` language it is required that `returnType` to be defined on FunctionData')
    
    if (fnData.params?.some((p => p.type === undefined))) 
      throw new Error('For `golang` language it is required that `params[*].type` to be defined on FunctionData')
  }

  return [
    codegen.top, // dependencies
    userCode,
    codegen.bottom, // recursion tracker
  ].join('\n\n')
}

const codegenFactory = (
  fnData: FunctionData,
  maxRecursiveCalls: number
): Record<SupportedLanguages, { top: string; bottom: string }> => ({
  node: {
    top: `
const safeStringify = (obj) => JSON.stringify(obj, replacer)

const replacer = (_key, value) => {
  if (value === Infinity) return 'Infinity'
  if (value === -Infinity) return '-Infinity'
  if (Number.isNaN(value)) return 'NaN'
  return value
}`,
    bottom: `
const MAX_RECURSIVE_CALLS = ${maxRecursiveCalls}

const vertices = {}

let currId = 0 // current vertex id
const memoizedResults = {} // for each list of args
const stack = [] // the current top is the parent id of the current vertex

function fn(...args) {
  if (currId > MAX_RECURSIVE_CALLS) {
    console.log('\\n')
    console.log(safeStringify({
      successValue: null,
      errorValue: MAX_RECURSIVE_CALLS
    }))
    process.exit(0)
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

const fnResult = fn(${(fnData.params || [])
      .map((p) => p.initialValue)
      .join(', ')})

console.log('\\n')
console.log(safeStringify({
  successValue: { 
    vertices, 
    fnResult: fnResult === undefined? null : fnResult 
  },
  errorValue: null
}))
`,
  },
  python: {
    top: `
import json
import math
import sys
import re

def safeStringify(o):
  str = json.dumps(o, separators=(',', ':'), indent=None)
  str = re.sub(r"((-?Infinity)|(NaN))", r'"\\1"', str)
  return str
`,
    bottom: `
MAX_RECURSIVE_CALLS = ${maxRecursiveCalls}

vertices = {}

currId = 0  # current vertex id
memoizedResults = {}  # for each list of args
stack = []  # the current top is the parent id of the current vertex

def fn(*args):
  global vertices, currId , memoizedResults, stack, errorValue, memoize

  if (currId > MAX_RECURSIVE_CALLS):
    print('\\n')
    print(safeStringify({
      'successValue': None, 
      'errorValue': MAX_RECURSIVE_CALLS
    }))
    sys.exit(0)

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

fnResult = fn(${(fnData.params || []).map((p) => p.initialValue).join(', ')})

print('\\n')
print(safeStringify({ 
  'successValue': { 'vertices': vertices, 'fnResult': fnResult }, 
  'errorValue': None 
}))
`,
  },
  golang: {
    top: `
package main

import (
	"encoding/json"
	"fmt"
	"math"
	"os"
  "reflect"
)

var _ = math.Inf(1)

func safeStringify(obj any) string {
	b, err := json.Marshal(obj)
	if err != nil {
		panic(err)
	}
	return string(b)
}

var _ json.Marshaler = Serializable{}

type Serializable struct {
	val any
}

func (r Serializable) MarshalJSON() ([]byte, error) {
	v := reflect.ValueOf(r.val)

	if v.Kind() == reflect.Float32 || v.Kind() == reflect.Float64 {
		if math.IsInf(v.Float(), 1) {
			return []byte("\\"Infinity\\""), nil
		}
		if math.IsInf(v.Float(), -1) {
			return []byte("\\"-Infinity\\""), nil
		}
		if math.IsNaN(v.Float()) {
			return []byte("\\"NaN\\""), nil
		}
	}

  // FIXME: how about v is list of float or map of float? :/

	return json.Marshal(r.val)
}`,
    bottom: `
var MAX_RECURSIVE_CALLS = ${maxRecursiveCalls}

type Adj struct {
  ChildId int \`json:"childId"\`
  Weight *Serializable  \`json:"weight"\`
}
type Vertice struct {
  ArgsList any \`json:"argsList"\`
  AdjList []*Adj \`json:"adjList"\`
  Memoized bool \`json:"memoized"\`
}
var vertices = map[int]Vertice{}

var currId = 0 // current vertex id
var memoizedResults = map[string]${fnData.returnType}{} // for each list of args
var stack = []int{} // the current top is the parent id of the current vertex

type Success struct {
  Vertices map[int]Vertice \`json:"vertices"\`
  FnResult Serializable  \`json:"fnResult"\`
}
type Output struct {
  SuccessValue *Success \`json:"successValue"\`
  ErrorValue *int \`json:"errorValue"\`
}

func fn(${(fnData.params || [])
      .map((p) => p.name + ' ' + p.type)
      .join(', ')}) ${fnData.returnType} {
  if (currId > MAX_RECURSIVE_CALLS) {
    fmt.Printf("\\n")
    fmt.Println(safeStringify(Output{
      SuccessValue: nil,
      ErrorValue: &MAX_RECURSIVE_CALLS,
    }))
    os.Exit(0)
  }

  args := []any{${(fnData.params || [])
    .map((p) => `Serializable{${p.name}}`)
    .join(', ')}}

  vertices[currId] = Vertice{
    ArgsList: args,
    AdjList: []*Adj{},
    Memoized: false,
  }

  adj := &Adj{
    ChildId: currId,
    Weight: nil,
  }

  if len(stack) > 0 {
    parentId := stack[len(stack) - 1]
    prev := vertices[parentId]
    prev.AdjList = append(prev.AdjList, adj)
    vertices[parentId] = prev
  }

  stack = append(stack, currId)
  currId += 1

  previousResult, exists := memoizedResults[safeStringify(args)]
  if memoize && exists {
    previousResultClone := &Serializable{previousResult}
    adj.Weight = previousResultClone
    if len(stack) > 0 {
      stack = stack[:len(stack)-1]
    }
    prev := vertices[adj.ChildId]
    prev.Memoized = true
    vertices[adj.ChildId] = prev
    return previousResult
  }

  result := _fn(${(fnData.params || []).map((p) => p.name).join(', ')})
  adj.Weight = &Serializable{result}

  if len(stack) > 0 {
    stack = stack[:len(stack)-1]
  }
  memoizedResults[safeStringify(args)] = result

  return result
}

func main() {
  fnResult := fn(${(fnData.params || []).map((p) => p.initialValue).join(', ')})

  fmt.Printf("\\n")
  fmt.Println(safeStringify(Output{
    SuccessValue: &Success{
      Vertices: vertices,
      FnResult: Serializable{fnResult},
    },
    ErrorValue: nil,
  }))
}`,
  },
})


export function toUserCode(
  fnData: FunctionData,
  lang: SupportedLanguages,
  memoize: boolean
) {
  const declare = buildDeclare(lang)

  const globalVarLines = (fnData.globalVariables || []).map((param) =>
    declare.variable(param.name, param.value)
  )

  return [
    ...globalVarLines,
    '',
    declare.function('_fn', fnData),
    '',
    declare.variable('memoize', declare.boolean(memoize)),
  ].join('\n')
}

/** HOC to build a declare function, that outputs a declaration for the specified language */
const buildDeclare = (lang: SupportedLanguages) => ({
  variable: (name: string, value: string) => {
    if (lang === 'node') return `const ${name} = ${value}`
    if (lang === 'python') return `${name} = ${value}`
    if (lang === 'golang') return `var ${name} = ${value}`
    throw new Error(`Unexpected lang, got ${lang}`)
  },
  boolean: (value: boolean) => {
    if (lang === 'node') return value === true ? 'true' : 'false'
    if (lang === 'python') return value === true ? 'True' : 'False'
    if (lang === 'golang') return value === true ? 'true' : 'false'
    throw new Error(`Unexpected lang, got ${lang}`)
  },
  function: (name: string, fnData: FunctionData) => {
    const params = fnData.params || []
    const body = fnData.body
    const returnType = fnData.returnType

    if (lang === 'node') {
      const paramsDeclaration = params.map((p) => p.name).join(', ')
      return [
        `function ${name}(${paramsDeclaration}) {`,
        indent(body),
        '}',
      ].join('\n')
    }
    if (lang === 'python') {
      const paramsDeclaration = params.map((p) => p.name).join(', ')
      return [`def ${name}(${paramsDeclaration}):`, indent(body)].join('\n')
    }
    if (lang === 'golang') {
      const paramsDeclaration = params
        .map((p) => `${p.name} ${p.type}`)
        .join(', ')
      return [
        `func ${name}(${paramsDeclaration}) ${returnType} {`,
        indent(body),
        '}',
      ].join('\n')
    }
    throw new Error(`Unexpected lang, got ${lang}`)
  },
})

const indent = (code: string) =>
  code
    .split('\n')
    .map((line) => `  ${line}`)
    .join('\n')
