module.exports = {
  extends: [
    '../common',
    './react',
    // Правила prettier всегда должны применяться после всех остальных
    'plugin:prettier/recommended',
    'prettier/react',
    'prettier/@typescript-eslint',
    './prettier-aware-overrides.js',
  ],
};
