module.exports = {
  overrides: [
    {
      plugins: ['react-hooks'],
      files: ['*.tsx'],
      rules: {
        'react/prop-types': 'off',
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
      },
    },
  ],
};
