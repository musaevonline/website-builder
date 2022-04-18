module.exports = {
  rules: {
    'max-len': [
      'error',
      {
        code: 80,
        ignoreTrailingComments: true,
        ignoreUrls: true,
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
      },
    ],
    'padding-line-between-statements': [
      'error',
      {
        blankLine: 'always',
        prev: '*',
        next: ['if', 'for', 'while', 'switch'],
      },
      { blankLine: 'always', prev: '*', next: 'return' },
      { blankLine: 'always', prev: ['const', 'let'], next: '*' },
      {
        blankLine: 'any',
        prev: ['const', 'let'],
        next: ['export', 'const', 'let'],
      },
    ],
    'new-parens': ['error', 'always'],
    'arrow-body-style': ['error', 'as-needed'],
    'arrow-parens': 'error',
    'eol-last': 'error',
    'linebreak-style': ['error', 'unix'],
    'dot-notation': 'error',
    'quote-props': ['error', 'as-needed', { keywords: true }],
    'no-multiple-empty-lines': 'error',
    'one-var': ['error', 'never'],
    'prefer-arrow-callback': ['error', { allowNamedFunctions: true }],
    '@typescript-eslint/indent': [
      'error',
      2,
      {
        SwitchCase: 1,
        outerIIFEBody: 1,
        MemberExpression: 1,
        CallExpression: {
          arguments: 1,
        },
        ArrayExpression: 1,
        ObjectExpression: 1,
        ImportDeclaration: 1,
        FunctionDeclaration: {
          parameters: 1,
        },
        FunctionExpression: {
          parameters: 1,
        },
      },
    ],
  },
};
