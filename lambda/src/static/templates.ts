// THIS FILE SHOULD BE SYMLINKED BETWEEN lambda/src/static/templates.ts and web/src/static/templates.ts, SO ANY CHANGES AFFECTS BOTH

const codefy = (...lines: string[]) => lines.map((line) => '  ' + line).join('\n')

export const templates = {
  fibo: {
    name: 'Fibonacci',
    fnData: {
      python: {
        params: [{ name: 'n', initialValue: '5' }],
        body: codefy(
          'if (n == 0 or n == 1):',
          '  return n',
          '',
          'return fn(n-1) + fn(n-2)'
        ),
      },
      node: {
        params: [{ name: 'n', initialValue: '5' }],
        body: codefy(
          'if (n == 0 || n == 1)',
          '  return n',
          '',
          'return fn(n-1) + fn(n-2)'
        ),
      },
      golang: {
        params: [{ name: 'n', type: 'int', initialValue: '5' }],
        returnType: 'int',
        body: codefy(
          'if n == 0 || n == 1 {',
          '  return n',
          '}',
          '',
          'return fn(n-1) + fn(n-2)'
        ),
      },
    },
  },
  bc: {
    name: 'Binomial Coefficient',
    fnData: {
      python: {
        params: [
          { name: 'n', initialValue: '5' },
          { name: 'k', initialValue: '2' },
        ],
        body: codefy(
          '# given n items, how many different possible subsets of k items can be formed',
          '',
          'if (k == 0 or n == k):',
          '  return 1',
          '',
          'return fn(n-1, k-1) + fn(n-1, k)'
        ),
      },
      node: {
        params: [
          { name: 'n', initialValue: '5' },
          { name: 'k', initialValue: '2' },
        ],
        body: codefy(
          '// given n items, how many different possible subsets of k items can be formed',
          '',
          'if (k == 0 || n == k)',
          '  return 1',
          '',
          'return fn(n-1, k-1) + fn(n-1, k)'
        ),
      },
      golang: {
        params: [
          { name: 'n', type: 'int', initialValue: '5' },
          { name: 'k', type: 'int', initialValue: '2' },
        ],
        returnType: 'int',
        body: codefy(
          '// given n items, how many different possible subsets of k items can be formed',
          '',
          'if k == 0 || n == k {',
          '  return 1',
          '}',
          '',
          'return fn(n-1, k-1) + fn(n-1, k)'
        ),
      },
    },
  },
  ss: {
    name: 'Subset Sum',
    fnData: {
      python: {
        globalVariables: [{ name: 'arr', value: '[1,3,4,5,2,10]' }],
        params: [
          { name: 'i', initialValue: '0' },
          { name: 's', initialValue: '7' },
        ],
        body: codefy(
          '# i-th number of arr, missing s for the current subset to arrive at the target sum',
          '',
          'if (s == 0): return 1',
          'if (i == len(arr) or s < 0): return 0',
          '',
          'return fn(i+1, s) + fn(i+1, s-arr[i])'
        ),
      },
      node: {
        globalVariables: [{ name: 'arr', value: '[1,3,4,5,2,10]' }],
        params: [
          { name: 'i', initialValue: '0' },
          { name: 's', initialValue: '7' },
        ],
        body: codefy(
          '// i-th number of arr, missing s for the current subset to arrive at the target sum',
          '',
          'if (s == 0) return 1',
          'if (i == arr.length || s < 0) return 0',
          '',
          'return fn(i+1, s) + fn(i+1, s-arr[i])'
        ),
      },
      golang: {
        globalVariables: [{ name: 'arr', value: '[]int{1,3,4,5,2,10}' }],
        params: [
          { name: 'i', type: 'int', initialValue: '0' },
          { name: 's', type: 'int', initialValue: '7' },
        ],
        returnType: 'int',
        body: codefy(
          '// i-th number of arr, missing s for the current subset to arrive at the target sum',
          '',
          'if s == 0 {',
          ' return 1',
          '}',
          'if i == len(arr) || s < 0 {',
          ' return 0',
          '}',
          'return fn(i+1, s) + fn(i+1, s-arr[i])'
        ),
      },
    },
  },
  ks: {
    name: '0-1 Knapsack',
    fnData: {
      python: {
        globalVariables: [
          { name: 'v', value: '[100,70,50,10]' },
          { name: 'w', value: '[10,4,6,12]' },
        ],
        params: [
          { name: 'i', initialValue: '0' },
          { name: 's', initialValue: '12' },
        ],
        body: codefy(
          '# i-th item, knapsack with available capacity s',
          '',
          'if (s < 0): return -math.inf',
          'if (i == len(v)): return 0',
          '',
          'return max(',
          '  fn(i+1, s),',
          '  v[i] + fn(i+1, s-w[i])',
          ')'
        ),
      },
      node: {
        globalVariables: [
          { name: 'v', value: '[100,70,50,10]' },
          { name: 'w', value: '[10,4,6,12]' },
        ],
        params: [
          { name: 'i', initialValue: '0' },
          { name: 's', initialValue: '12' },
        ],
        body: codefy(
          '// i-th item, knapsack with available capacity s',
          '',
          'if (s < 0) return -Infinity',
          'if (i == v.length) return 0',
          '',
          'return Math.max(',
          '  fn(i+1, s),',
          '  v[i] + fn(i+1, s-w[i])',
          ')'
        ),
      },
      golang: {
        globalVariables: [
          { name: 'v', value: '[]int{100,70,50,10}' },
          { name: 'w', value: '[]int{10,4,6,12}' },
        ],
        params: [
          { name: 'i', type: 'int', initialValue: '0' },
          { name: 's', type: 'int', initialValue: '12' },
        ],
        returnType: 'float64',
        body: codefy(
          '// i-th item, knapsack with available capacity s',
          '',
          'if s < 0 {',
          ' return math.Inf(-1)',
          '}',
          'if i == len(v) {',
          ' return 0',
          '}',
          '',
          'return math.Max(',
          '  fn(i+1, s),',
          '  float64(v[i]) + fn(i+1, s-w[i]),',
          ')'
        ),
      },
    },
  },
  cc: {
    name: 'Coin Change',
    fnData: {
      python: {
        globalVariables: [{ name: 'coins', value: '[1,3,4,5]' }],
        params: [{ name: 'v', initialValue: '5' }],
        body: codefy(
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
          'return ans'
        ),
      },
      node: {
        globalVariables: [{ name: 'coins', value: '[1,3,4,5]' }],
        params: [{ name: 'v', initialValue: '5' }],
        body: codefy(
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
          'return ans'
        ),
      },
      golang: {
        globalVariables: [{ name: 'coins', value: '[]int{1,3,4,5}' }],
        params: [{ name: 'v', type: 'int', initialValue: '5' }],
        returnType: 'float64',
        body: codefy(
          '// remaining v cents',
          '',
          'if v == 0 {',
          ' return 0',
          '}',
          'if v < 0 {',
          ' return math.Inf(1)',
          '}',
          '',
          'ans := math.Inf(1)',
          'for _, coin := range coins {',
          '  ans = math.Min(',
          '    ans,',
          '    float64(1) + fn(v - coin),',
          '  )',
          '}',
          'return ans'
        ),
      },
    },
  },
  lcs: {
    name: 'Longest Common Subsequence',
    fnData: {
      python: {
        globalVariables: [
          { name: 'a', value: "'AGTB'" },
          { name: 'b', value: "'GTXAB'" },
        ],
        params: [
          { name: 'i', initialValue: '0' },
          { name: 'j', initialValue: '0' },
        ],
        body: codefy(
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
          ')'
        ),
      },
      node: {
        globalVariables: [
          { name: 'a', value: "'AGTB'" },
          { name: 'b', value: "'GTXAB'" },
        ],
        params: [
          { name: 'i', initialValue: '0' },
          { name: 'j', initialValue: '0' },
        ],
        body: codefy(
          '// i-th char of a, j-th char of b',
          '',
          'if (i == a.length || j == b.length) return 0',
          '',
          'if (a[i] == b[j])',
          '  return 1 + fn(i+1, j+1)',
          '',
          'return Math.max(',
          '  fn(i+1, j),',
          '  fn(i, j+1)',
          ')'
        ),
      },
      golang: {
        globalVariables: [
          { name: 'a', value: '"AGTB"' },
          { name: 'b', value: '"GTXAB"' },
        ],
        params: [
          { name: 'i', type: 'int', initialValue: '0' },
          { name: 'j', type: 'int', initialValue: '0' },
        ],
        returnType: 'int',
        body: codefy(
          '// i-th char of a, j-th char of b',
          '',
          'if i == len(a) || j == len(b) {',
          ' return 0',
          '}',
          'if a[i] == b[j] {',
          ' return 1 + fn(i+1, j+1)',
          '}',
          '',
          'return int(math.Max(',
          ' float64(fn(i+1, j)),',
          ' float64(fn(i, j+1)),',
          '))'
        ),
      },
    },
  },
  tsp: {
    name: 'Traveling Salesman Problem',
    fnData: {
      python: {
        globalVariables: [
          { name: 'cities', value: '4' },
          {
            name: 'adjMat',
            value: [
              '[[0, 20, 42, 35],',
              ' [20, 0, 30, 34],',
              ' [42, 30, 0, 12],',
              ' [35, 34, 12, 0]]',
            ].join('\n'),
          },
        ],
        params: [
          { name: 'u', initialValue: '0' },
          { name: 'mask', initialValue: '1' },
        ],
        body: codefy(
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
          'return ans'
        ),
      },
      node: {
        globalVariables: [
          { name: 'cities', value: '4' },
          {
            name: 'adjMat',
            value: [
              '[[0, 20, 42, 35],',
              ' [20, 0, 30, 34],',
              ' [42, 30, 0, 12],',
              ' [35, 34, 12, 0]]',
            ].join('\n'),
          },
        ],
        params: [
          { name: 'u', initialValue: '0' },
          { name: 'mask', initialValue: '1' },
        ],
        body: codefy(
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
          'return ans'
        ),
      },
      golang: {
        globalVariables: [
          { name: 'cities', value: '4' },
          {
            name: 'adjMat',
            value: [
              '[][]int{',
              ' {0, 20, 42, 35},',
              ' {20, 0, 30, 34},',
              ' {42, 30, 0, 12},',
              ' {35, 34, 12, 0},',
              '}',
            ].join('\n'),
          },
        ],
        params: [
          { name: 'u', type: 'int', initialValue: '0' },
          { name: 'mask', type: 'int', initialValue: '1' },
        ],
        returnType: 'float64',
        body: codefy(
          '// current city u, set of visited cities mask (including u)',
          '',
          '// all cities were visited',
          'if mask == (1 << cities) - 1 {',
          '  return float64(adjMat[u][0])',
          '}',
          '',
          'ans := math.Inf(1)',
          '',
          '// for each unvisited city v',
          'for v := 0; v < cities; v++ {',
          '  if ((mask & (1 << v)) == 0) {',
          '    ans = math.Min(',
          '      ans,',
          '      float64(adjMat[u][v]) + fn(v, mask | (1 << v)),',
          '    )',
          '  }',
          '}',
          '',
          'return ans'
        ),
      },
    },
  },
  pow: {
    name: 'Fast Power',
    fnData: {
      python: {
        params: [
          { name: 'a', initialValue: '2' },
          { name: 'n', initialValue: '5' },
        ],
        body: codefy(
          'if (n == 0):',
          '  return 1',
          '',
          'if (n % 2 == 0):',
          '  return fn(a*a, n/2)',
          '',
          'return a * fn(a*a, (n-1)/2)'
        ),
      },
      node: {
        params: [
          { name: 'a', initialValue: '2' },
          { name: 'n', initialValue: '5' },
        ],
        body: codefy(
          'if (n == 0)',
          '  return 1',
          '',
          'if (n % 2 == 0)',
          '  return fn(a*a, n/2)',
          '',
          'return a * fn(a*a, (n-1)/2)'
        ),
      },
      golang: {
        params: [
          { name: 'a', type: 'int', initialValue: '2' },
          { name: 'n', type: 'int', initialValue: '5' },
        ],
        returnType: 'int',
        body: codefy(
          'if n == 0 {',
          '  return 1',
          '}',
          '',
          'if n % 2 == 0 {',
          '  return fn(a*a, n/2)',
          '}',
          '',
          'return a * fn(a*a, (n-1)/2)'
        ),
      },
    },
  },
  // mcm: {
  //   name: 'Matrix Chain Multiplication',
  //   fnData: {
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
