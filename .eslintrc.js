module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/standard',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    '@typescript-eslint/no-namespace': 'off',
    'no-inner-declarations': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    'padded-blocks': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    yoda: 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'no-extra-parens': 'off',
    'no-eval': 'off',
    '@typescript-eslint/no-this-alias': 'off',
    'no-useless-escape': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    'no-use-before-define': 'off',
    'object-curly-spacing': 'off',
    'no-undef': 'off',
    'space-before-function-paren': 'off',
    'semi': 'off',
    'prefer-const': 'off',
    'keyword-spacing': 'off'
  }
}
