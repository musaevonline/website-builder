module.exports = {
  env: {
    browser: true,
    node: true,
    jest: true,
    jasmine: true,
    es6: true,
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2019,
    sourceType: 'module',
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    './formatting-code',
    './best-practices',
    './conventions',
    '../typescript',
    './jsdoc',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
};
