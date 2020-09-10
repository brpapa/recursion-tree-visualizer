import { TemplateKeys, FunctionData } from '../../types'

const unify = (lines: string[]) => lines.map((line) => '  ' + line).join('\n')

const templates: Record<TemplateKeys, FunctionData> = {
  fibonacci: {
    params: [{ name: 'n', value: '5' }],
    body: unify([
      'if (n == 0 || n == 1)',
      '  return n',
      'return fn(n-1) + fn(n-2)',
    ]),
  },
  knapsack: {
    params: [
      { name: 'i', value: '3' },
      { name: 's', value: '12' },
    ],
    body: unify([
      '// i-th item, remaining capacity s',
      '',
      'if (s < 0) return -Infinity',
      'if (i < 0) return 0',
      '',
      'return Math.max(',
      "  fn(i-1, s), // don't choose i",
      '  v[i] + fn(i-1, s-w[i]) // choose i',
      ')',
    ]),
    variables: [
      { name: 'v', value: '[100, 70, 50, 10]' },
      { name: 'w', value: '[10, 4, 6, 12]' },
    ],
  },
  coinChange: {
    // params: [{ name: 'v', value: '7' }],
    params: [{ name: 'v', value: '5' }],
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
    variables: [{ name: 'coins', value: '[1,3,4,5]' }],
  },
  fastPower: {
    params: [
      { name: 'a', value: '2' },
      { name: 'n', value: '5' },
    ],
    body: unify([
      'if (n == 0)',
      '  return 1',
      'if (n % 2 == 0)',
      '  return fn(a*a, n/2)',
      'return a * fn(a*a, (n-1)/2)',
    ]),
  },
}

export default templates
