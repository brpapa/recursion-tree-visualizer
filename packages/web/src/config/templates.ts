import { Template, FunctionData, Language } from '../types'

const codefy = (lines: string[]) => lines.map((line) => '  ' + line).join('\n')

type TemplateData = { name: string; fnData: Record<Language, FunctionData> }

const templates: Record<Template, TemplateData> = {
  custom: {
    name: 'Custom',
    fnData: {
      node: {
        body: codefy(['// type your own code here']),
      },
      python: {
        body: codefy(['# type your own code here']),
      },
    },
  },
  fibo: {
    name: 'Fibonacci',
    fnData: {
      node: {
        params: [{ name: 'n', initialValue: '5' }],
        body: codefy([
          'if (n == 0 || n == 1)',
          '  return n',
          '',
          'return fn(n-1) + fn(n-2)',
        ]),
      },
      python: {
        params: [{ name: 'n', initialValue: '5' }],
        body: codefy([
          'if (n == 0 or n == 1):',
          '  return n',
          '',
          'return fn(n-1) + fn(n-2)',
        ]),
      },
    },
  },
  bc: {
    name: 'Binomial Coefficient',
    fnData: {
      node: {
        params: [
          { name: 'n', initialValue: '5' },
          { name: 'k', initialValue: '2' },
        ],
        body: codefy([
          '// given n items, how many different possible subsets of k items can be formed',
          '',
          'if (k == 0 || n == k)',
          '  return 1',
          '',
          'return fn(n-1, k-1) + fn(n-1, k)',
        ]),
      },
      python: {
        params: [
          { name: 'n', initialValue: '5' },
          { name: 'k', initialValue: '2' },
        ],
        body: codefy([
          '# given n items, how many different possible subsets of k items can be formed',
          '',
          'if (k == 0 or n == k):',
          '  return 1',
          '',
          'return fn(n-1, k-1) + fn(n-1, k)',
        ]),
      },
    },
  },
  ss: {
    name: 'Subset Sum',
    fnData: {
      node: {
        globalVariables: [{ name: 'arr', value: '[1,3,4,5,2,10]' }],
        params: [
          { name: 'i', initialValue: '0' },
          { name: 's', initialValue: '7' },
        ],
        body: codefy([
          '// i-th number of arr, missing s for the current subset to arrive at the target sum',
          '',
          'if (s == 0) return 1',
          'if (i == arr.length || s < 0) return 0',
          '',
          'return fn(i+1, s) + fn(i+1, s-arr[i])',
        ]),
      },
      python: {
        globalVariables: [{ name: 'arr', value: '[1,3,4,5,2,10]' }],
        params: [
          { name: 'i', initialValue: '0' },
          { name: 's', initialValue: '7' },
        ],
        body: codefy([
          '# i-th number of arr, missing s for the current subset to arrive at the target sum',
          '',
          'if (s == 0): return 1',
          'if (i == len(arr) or s < 0): return 0',
          '',
          'return fn(i+1, s) + fn(i+1, s-arr[i])',
        ]),
      },
    },
  },
  ks: {
    name: '0-1 Knapsack',
    fnData: {
      node: {
        globalVariables: [
          { name: 'v', value: '[100,70,50,10]' },
          { name: 'w', value: '[10,4,6,12]' },
        ],
        params: [
          { name: 'i', initialValue: '0' },
          { name: 's', initialValue: '12' },
        ],
        body: codefy([
          '// i-th item, knapsack with available capacity s',
          '',
          'if (s < 0) return -Infinity',
          'if (i == v.length) return 0',
          '',
          'return Math.max(',
          '  fn(i+1, s),',
          '  v[i] + fn(i+1, s-w[i])',
          ')',
        ]),
      },
      python: {
        globalVariables: [
          { name: 'v', value: '[100,70,50,10]' },
          { name: 'w', value: '[10,4,6,12]' },
        ],
        params: [
          { name: 'i', initialValue: '0' },
          { name: 's', initialValue: '12' },
        ],
        body: codefy([
          '# i-th item, knapsack with available capacity s',
          '',
          'if (s < 0): return -math.inf',
          'if (i == len(v)): return 0',
          '',
          'return max(',
          '  fn(i+1, s),',
          '  v[i] + fn(i+1, s-w[i])',
          ')',
        ]),
      },
    },
  },
  cc: {
    name: 'Coin Change',
    fnData: {
      node: {
        globalVariables: [{ name: 'coins', value: '[1,3,4,5]' }],
        params: [{ name: 'v', initialValue: '5' }],
        body: codefy([
          '// remaining v cents',
          '',
          'if (v == 0) return 0',
          'if (v < 0) return Infinity',
          '',
          'let ans = Infinity',
          'for (const coin of coins)',
          '  ans = Math.min(',
          '    ans,',
          '    1 + fn(v - coin)',
          '  )',
          'return ans',
        ]),
      },
      python: {
        globalVariables: [{ name: 'coins', value: '[1,3,4,5]' }],
        params: [{ name: 'v', initialValue: '5' }],
        body: codefy([
          '# remaining v cents',
          '',
          'if (v == 0): return 0',
          'if (v < 0): return math.inf',
          '',
          'ans = math.inf',
          'for coin in coins:',
          '  ans = min(',
          '    ans,',
          '    1 + fn(v - coin)',
          '  )',
          'return ans',
        ]),
      },
    },
  },
  lcs: {
    name: 'Longest Common Subsequence',
    fnData: {
      node: {
        globalVariables: [
          { name: 'a', value: "'AGTB'" },
          { name: 'b', value: "'GTXAB'" },
        ],
        params: [
          { name: 'i', initialValue: '0' },
          { name: 'j', initialValue: '0' },
        ],
        body: codefy([
          '// i-th char of a, j-th char of b',
          '',
          'if (i == a.length',
          ' || j == b.length) return 0',
          '',
          'if (a[i] == b[j])',
          '  return 1+fn(i+1, j+1)',
          '',
          'return Math.max(',
          '  fn(i+1, j),',
          '  fn(i, j+1)',
          ')',
        ]),
      },
      python: {
        globalVariables: [
          { name: 'a', value: "'AGTB'" },
          { name: 'b', value: "'GTXAB'" },
        ],
        params: [
          { name: 'i', initialValue: '0' },
          { name: 'j', initialValue: '0' },
        ],
        body: codefy([
          '# i-th char of a, j-th char of b',
          '',
          'if (i == len(a) or j == len(b)):',
          '  return 0',
          '',
          'if (a[i] == b[j]):',
          '  return 1+fn(i+1, j+1)',
          '',
          'return max(',
          '  fn(i+1, j),',
          '  fn(i, j+1)',
          ')',
        ]),
      },
    },
  },
  tsp: {
    name: 'Traveling Salesman Problem',
    fnData: {
      node: {
        globalVariables: [
          { name: 'cities', value: '4' },
          {
            name: 'adjMat',
            value:
              '[[0, 20, 42, 35],\n [20, 0, 30, 34],\n [42, 30, 0, 12],\n [35, 34, 12, 0]]',
          },
        ],
        params: [
          { name: 'u', initialValue: '0' },
          { name: 'mask', initialValue: '1' },
        ],
        body: codefy([
          '// current city u, set of visited cities mask (including u)',
          '',
          '// all cities were visited',
          'if (mask == (1 << cities) - 1)',
          '  return adjMat[u][0]',
          '',
          'let ans = Infinity',
          '',
          '// for each unvisited city v',
          'for (let v = 0; v < cities; v++)',
          '  if ((mask & (1 << v)) == 0)',
          '    ans = Math.min(',
          '      ans,',
          '      adjMat[u][v] + fn(v, mask | (1 << v))',
          '    )',
          '',
          'return ans',
        ]),
      },
      python: {
        globalVariables: [
          { name: 'cities', value: '4' },
          {
            name: 'adjMat',
            value:
              '[[0, 20, 42, 35],\n [20, 0, 30, 34],\n [42, 30, 0, 12],\n [35, 34, 12, 0]]',
          },
        ],
        params: [
          { name: 'u', initialValue: '0' },
          { name: 'mask', initialValue: '1' },
        ],
        body: codefy([
          '# current city u, set of visited cities mask (including u)',
          '',
          '# all cities were visited',
          'if (mask == (1 << cities) - 1):',
          '  return adjMat[u][0]',
          '',
          'ans = math.inf',
          '',
          '# for each unvisited city v',
          'for v in range(0, cities):',
          '  if ((mask & (1 << v)) == 0):',
          '    ans = min(',
          '      ans,',
          '      adjMat[u][v] + fn(v, mask | (1 << v))',
          '    )',
          '',
          'return ans',
        ]),
      },
    },
  },
  pow: {
    name: 'Fast Power',
    fnData: {
      node: {
        params: [
          { name: 'a', initialValue: '2' },
          { name: 'n', initialValue: '5' },
        ],
        body: codefy([
          'if (n == 0)',
          '  return 1',
          '',
          'if (n % 2 == 0)',
          '  return fn(a*a, n/2)',
          '',
          'return a * fn(a*a, (n-1)/2)',
        ]),
      },
      python: {
        params: [
          { name: 'a', initialValue: '2' },
          { name: 'n', initialValue: '5' },
        ],
        body: codefy([
          'if (n == 0):',
          '  return 1',
          '',
          'if (n % 2 == 0):',
          '  return fn(a*a, n/2)',
          '',
          'return a * fn(a*a, (n-1)/2)',
        ]),
      },
    },
  },
  // mcm: {
  //   name: 'Matrix Chain Multiplication',
  //   functionData: {
  //     node: {
  //       globalVariables: [{ name: 'D', value: '[1,2,3,4,5]' }],
  //       params: [
  //         { name: 'i', initialValue: '1' },
  //         { name: 'j', initialValue: '4' },
  //       ],
  //       body: codefy([
  //         'if (i == j) return 0',
  //         '',
  //         'let ans = Infinity;',
  //         '',
  //         'for (let k = i; k <= j-1; k++)',
  //         '  ans = Math.min(',
  //         '    ans,',
  //         '    D[i-1]*D[k]*D[j] + fn(i, k) + fn(k+1, j)',
  //         '  )',
  //         '',
  //         'return ans',
  //       ]),
  //     }
  //   }
  // },
}

export default templates
