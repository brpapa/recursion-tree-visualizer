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
      { name: 'w', value: '12' },
    ],
    body: unify([
      'if (w == 0 || i < 0)',
      '  return 0',
      'if (a2[i] > w)',
      '  return fn(i-1, w)',
      '',
      'return Math.max(',
      '  a1[i] + fn(i-1, w-a2[i]),',
      '  fn(i-1, w)',
      ')',
    ]),
    variables: [
      { name: 'a1', value: '[100, 70, 50, 10, 20]' },
      { name: 'a2', value: '[10, 4, 6, 12, 20]' },
    ],
  },
}

export default templates
