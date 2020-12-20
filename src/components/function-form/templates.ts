import { Templates, FunctionData } from '../../types'

const codefy = (lines: string[]) => lines.map((line) => '  ' + line).join('\n')

const templates: Record<Templates, FunctionData> = {
  custom: {
    name: 'Custom',
    params: [{ name: '', value: '' }],
    body: codefy(['// type your own code']),
  },
  fibo: {
    name: 'Fibonacci',
    params: [{ name: 'n', value: '5' }],
    body: codefy([
      'if (n == 0 || n == 1)',
      '  return n',
      '',
      'return fn(n-1) + fn(n-2)',
    ]),
  },
  bc: {
    name: 'Binomial Coefficient',
    params: [
      { name: 'n', value: '5' },
      { name: 'k', value: '2' },
    ],
    body: codefy([
      '// given n items, how many different possible subsets of k items can be formed',
      '',
      'if (k == 0 || n == k) return 1',
      'return fn(n-1, k-1) + fn(n-1, k)',
    ]),
  },
  ss: {
    name: 'Subset Sum',
    variables: [{ name: 'arr', value: '[1,3,4,5,2,10]' }],
    params: [
      { name: 'i', value: '0' },
      { name: 's', value: '7' },
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
  ks: {
    name: '0-1 Knapsack',
    variables: [
      { name: 'v', value: '[100,70,50,10]' },
      { name: 'w', value: '[10,4,6,12]' },
    ],
    params: [
      { name: 'i', value: '0' },
      { name: 's', value: '12' },
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
  cc: {
    name: 'Coin Change',
    variables: [{ name: 'coins', value: '[1,3,4,5]' }],
    params: [{ name: 'v', value: '5' }],
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
  lcs: {
    name: 'Longest Common Subsequence',
    variables: [
      { name: 'a', value: "'AGTB'" },
      { name: 'b', value: "'GTXAB'" },
    ],
    params: [
      { name: 'i', value: '0' },
      { name: 'j', value: '0' },
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
  tsp: {
    name: 'Traveling Salesman Problem',
    variables: [
      { name: 'cities', value: '4' },
      {
        name: 'adjMat',
        value:
          '[[0, 20, 42, 35],\n [20, 0, 30, 34],\n [42, 30, 0, 12],\n [35, 34, 12, 0]]',
      },
    ],
    params: [
      { name: 'u', value: '0' },
      { name: 'mask', value: '1' },
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
  pow: {
    name: 'Fast Power',
    params: [
      { name: 'a', value: '2' },
      { name: 'n', value: '5' },
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
  mcm: {
    name: 'Matrix Chain Multiplication',
    variables: [{ name: 'D', value: '[1,2,3,4,5]' }],
    params: [
      { name: 'i', value: '1' },
      { name: 'j', value: '4' },
    ],
    body: codefy([
      'if (i == j) return 0',
      '',
      'let ans = Infinity;',
      '',
      'for (let k = i; k <= j-1; k++)',
      '  ans = Math.min(',
      '    ans,',
      '    D[i-1]*D[k]*D[j] + fn(i, k) + fn(k+1, j)',
      '  )',
      '',
      'return ans',
    ]),
  },
}

export default templates
