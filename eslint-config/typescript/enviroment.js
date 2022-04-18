const extensions = require('../consts');
const { tsOnly } = require('../utils/ts');

module.exports = tsOnly({
  env: {
    es6: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    sourceType: 'module',
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': extensions.ts,
    },
  },
  plugins: ['@typescript-eslint', 'functional'],
});
