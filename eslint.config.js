import antfu from '@antfu/eslint-config'

export default antfu(
  {
    formatters: true,
    ignores: [
      'public/**/*',
    ],
  },
  {
    rules: {
      curly: ['error', 'all'],
    },
  },
)
