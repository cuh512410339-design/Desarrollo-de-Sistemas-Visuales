module.exports = {
  root: true,
  env: { node: true, es2021: true },
  parserOptions: { ecmaVersion: 2020, sourceType: 'module' },
  overrides: [
    {
      files: ['server/**/*.{ts,js}'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      extends: ['plugin:@typescript-eslint/recommended'],
      parserOptions: { project: ['./server/tsconfig.json'] }
    },
    {
      files: ['client/**/*.{ts,tsx}'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint', 'react'],
      extends: ['plugin:@typescript-eslint/recommended'],
      settings: { react: { version: 'detect' } },
      parserOptions: { ecmaFeatures: { jsx: true }, project: ['./client/tsconfig.json'] }
    }
  ]
};
