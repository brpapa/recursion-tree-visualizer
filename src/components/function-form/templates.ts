import { Templates, FunctionData } from '../../types'

const unify = (lines: string[]) => lines.map((line) => '  ' + line).join('\n')

const templates: Record<Templates, FunctionData> = {
  fibo: {
    name: 'Fibonacci',
    params: [{ name: 'n', value: '5' }],
    body: unify([
      'if (n == 0 || n == 1)',
      '  return n',
      '',
      'return fn(n-1) + fn(n-2)',
    ]),
  },
  ks: {
    name: 'Knapsack',
    params: [
      { name: 'i', value: '0' },
      { name: 's', value: '12' },
    ],
    variables: [
      { name: 'v', value: '[100,70,50,10]' },
      { name: 'w', value: '[10,4,6,12]' },
    ],
    body: unify([
      '// i-th item, remaining capacity s',
      '',
      'if (s < 0) return -Infinity',
      'if (i == v.length) return 0',
      '',
      'return Math.max(',
      "  fn(i+1, s), // don't choose i",
      '  v[i] + fn(i+1, s-w[i]) // choose i',
      ')',
    ]),
  },
  cc: {
    name: 'Coin Change',
    params: [{ name: 'v', value: '5' }],
    variables: [{ name: 'coins', value: '[1,3,4,5]' }],
    body: unify([
      '// remaining v cents',
      '',
      'if (v === 0) return 0',
      'if (v < 0) return Infinity',
      '',
      'let min = Infinity',
      'for (const coin of coins)',
      '  min = Math.min(min, 1 + fn(v - coin))',
      'return min',
    ]),
  },
  power: {
    name: 'Fast Power',
    params: [
      { name: 'a', value: '2' },
      { name: 'n', value: '5' },
    ],
    body: unify([
      'if (n == 0)',
      '  return 1',
      '',
      'if (n % 2 == 0)',
      '  return fn(a*a, n/2)',
      '',
      'return a * fn(a*a, (n-1)/2)',
    ]),
  },
  lcs: {
    name: 'Longest Common Subsequence',
    params: [
      { name: 'i', value: '0' },
      { name: 'j', value: '0' },
    ],
    variables: [
      { name: 'a', value: "'AGTB'" },
      { name: 'b', value: "'GTXAB'" },
    ],
    body: unify([
      'if (i == a.length || j == b.length)',
      '  return 0',
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
}

export default templates
