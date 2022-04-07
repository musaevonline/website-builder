module.exports = {
  rules: {
    'no-restricted-globals': [
      'error',
      {
        name: 'event',
        message: 'Use local parameter instead.',
      },
      {
        name: 'fdescribe',
        message: 'Do not commit fdescribe. Use describe() instead.',
      },
      {
        name: 'fit',
        message: 'Do not commit fit. Use it() instead.',
      },
    ],
    'no-eval': 'error',
    'no-new-func': 'error',
    'no-implied-eval': 'error',
    'no-prototype-builtins': 'warn',
    'no-extra-boolean-cast': 'warn',
    'guard-for-in': 'error',
    'no-labels': [
      'error',
      {
        allowLoop: false,
        allowSwitch: false,
      },
    ],
    'no-unused-labels': 'error',
    'no-caller': 'error',
    'no-cond-assign': 'error',
    'no-new-wrappers': 'error',
    'no-debugger': 'warn',
    'no-redeclare': 'error',
    'no-fallthrough': 'error',
    'no-var': 'error',
    'no-unused-expressions': 'error',
    'prefer-const': ['error', { destructuring: 'any' }],
    eqeqeq: 'error',
    'use-isnan': [
      'error',
      { enforceForSwitchCase: true, enforceForIndexOf: true },
    ],
    'no-empty-function': [
      'error',
      {
        allow: [
          'arrowFunctions',
          'constructors',
          'setters',
          'getters',
          'methods',
        ],
      },
    ],
    'no-nested-ternary': 'error',
    'no-undef': 'error',
  },
};
