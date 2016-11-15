module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  env: {
    'es6': true,
    'browser': true,
    'jquery': true
  },
  // add your custom rules here
  rules: {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    // 要求或禁止函数圆括号之前有一个空格
    // http://eslint.cn/docs/rules/space-before-function-paren
    'space-before-function-paren': 0,
    // 'no-unused-vars': 0,
    // 'no-undef': 0
    // 'no-useless-escape': 0
  }
}
