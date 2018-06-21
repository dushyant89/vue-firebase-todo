module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/airbnb'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'indent': [2, 4],
      'no-param-reassign': 'off',
      'one-var': 'off',
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
};