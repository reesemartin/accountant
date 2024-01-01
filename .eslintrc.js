module.exports = {
  env: {
    es2022: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    project: ['./tsconfig.json'],
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'jest', 'sort-keys'],
  rules: {
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prettier/prettier': 'warn',
    'sort-keys': 0, // disable default eslint sort-keys
    'sort-keys/sort-keys-fix': 1,
  },
}
