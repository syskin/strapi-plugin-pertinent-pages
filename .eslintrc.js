module.exports = {
  env: {
    es6: true,
    node: true,
  },
  parser: `babel-eslint`,
  extends: [`prettier`, `plugin:react/recommended`],
  plugins: [`prettier`],
  globals: {
    Atomics: `readonly`,
    SharedArrayBuffer: `readonly`,
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: `module`,
  },
  settings: {
    react: {
      version: `16.5.2`,
    },
  },
  rules: {
    "no-console": 1,
    quotes: [`error`, `backtick`],
    "prettier/prettier": `error`,
    "class-methods-use-this": `off`,
    "no-param-reassign": `off`,
    "no-unused-vars": [`error`, { argsIgnorePattern: `next` }],
  },
};
