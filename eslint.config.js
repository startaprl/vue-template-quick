import antfu from '@antfu/eslint-config'

export default antfu(
  {
    vue: true,
    typescript: true,
    ignores: [
    ],
    gitignore: true,
    stylistic: true,
    jsonc: true,
    yaml: false,
    formatters: {
      css: true,
      html: true,
      txt: true,
      markdown: 'prettier',
    },
    rules: {

    },
  },
)
