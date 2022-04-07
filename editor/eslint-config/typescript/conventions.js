const { tsOnly } = require('../utils/ts');

module.exports = tsOnly({
  rules: {
    'no-unused-vars': 'off', // Типы и интерфейсы не распознаются eslint
    'no-use-before-define': 'off', // Типы и интерфейсы не распознаются eslint
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        vars: 'local',
        args: 'none',
        ignoreRestSiblings: true,
        argsIgnorePattern: '^_',
        caughtErrors: 'none',
      },
    ],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'interface',
        format: ['PascalCase'],
        custom: {
          regex: '^I[A-Z]',
          match: true,
        },
      },
      {
        selector: 'typeAlias',
        format: ['PascalCase'],
        custom: {
          regex: '^T[A-Z]',
          match: true,
        },
      },
      {
        selector: 'class',
        format: ['PascalCase'],
      },
    ],
    '@typescript-eslint/no-use-before-define': 'warn',
    '@typescript-eslint/no-inferrable-types': [
      'error',
      {
        ignoreParameters: true,
        ignoreProperties: false,
      },
    ],
    '@typescript-eslint/prefer-namespace-keyword': 'error',
    '@typescript-eslint/triple-slash-reference': 'error',
    '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
    // Автофикс предпочтения readonly вызывает проблемы
    '@typescript-eslint/prefer-readonly': 'off',
    // Автофикс предпочтения readonly вызывает проблемы
    'functional/prefer-readonly-type': 'off',
    // https://github.com/typescript-eslint/typescript-eslint/issues/291
    'no-dupe-class-members': 'off',
  },
});
