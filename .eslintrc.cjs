module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    "airbnb",
    "airbnb/hooks"
  ],
  settings: {
    "import/resolver": {
      typescript: {}
    }
  },
  ignorePatterns: ['dist', '.eslintrc.cjs', 'vite.config.ts', 'node_modules'],
  plugins: ['react-refresh'],
  rules: {
    "quotes": [2, "double", { "avoidEscape": true }],
    "@typescript-eslint/no-explicit-any": ["off"],
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    "react/react-in-jsx-scope": "off",
    "react/jsx-uses-react": "off",
    "max-lines-per-function": ["warn", 50],
    "complexity": ["warn", 10],
    "import/extensions": [ "error", "ignorePackages", { "ts": "never", "tsx": "never" } ],
  },
}
