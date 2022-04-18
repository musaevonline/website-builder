const extensions = require('../consts');

module.exports = {
  plugins: ['import'],
  settings: {
    'import/extensions': extensions.all,
    'import/resolver': {
      node: {
        extensions: extensions.all,
      },
    },
  },
  rules: {
    'no-bitwise': 'error',
    'no-console': [
      'error',
      {
        allow: ['warn', 'error'],
      },
    ],
    'no-empty': ['warn', { allowEmptyCatch: true }],
    radix: 'error',
    'import/no-default-export': 'off',
    'no-else-return': ['error', { allowElseIf: false }],
    'no-lonely-if': 'error',
    'prefer-destructuring': [
      'error',
      {
        array: false,
        object: true,
      },
      { enforceForRenamedProperties: false },
    ],
    'object-shorthand': ['error', 'properties'],
    'multiline-ternary': ['error', 'always-multiline'],
    'operator-linebreak': [
      'error',
      'before',
      {
        overrides: {
          '=': 'none',
          '==': 'none',
          '===': 'none',
        },
      },
    ],
    'no-unused-vars': [
      'error',
      {
        vars: 'local',
        args: 'none',
        ignoreRestSiblings: true,
        argsIgnorePattern: '^_',
        caughtErrors: 'none',
      },
    ],
    'no-use-before-define': 'warn',
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        alphabetize: { order: 'asc' },
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        pathGroups: [
          {
            pattern: '@hmdb/**',
            group: 'internal',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
      },
    ],
  },
};
