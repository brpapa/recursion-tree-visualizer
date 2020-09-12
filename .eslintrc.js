module.exports = {
  env: {
    es6: true,
    browser: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
  ],
  plugins: ['react', 'react-hooks', '@typescript-eslint'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'linebreak-style': ['error', 'unix'],
    'no-console': 'warn',
    'no-empty': 'warn',
    'react/prop-types': ['off'],
    'no-unused-vars': 'off', // se ligado, acusará os tipos
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { vars: 'all', args: 'after-used', ignoreRestSiblings: false },
    ],
    // '@typescript-eslint/explicit-function-return-type': 'warn', // consider using explicit annotations for object literals and function return types even when they can be inferred
    'react-hooks/rules-of-hooks': 'error', // check rules of hooks
    'react-hooks/exhaustive-deps': 'warn', // check effect dependencies
  },
}
