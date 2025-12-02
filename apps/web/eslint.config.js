import { nextJsConfig } from '@repo/eslint-config/next-js'
import tseslint from 'typescript-eslint'

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    ignores: ['*.config.cjs', 'ecosystem.config.cjs'],
  },
  ...nextJsConfig,
  {
    files: ['eslint.config.js', '*.config.js'],
    ...tseslint.configs.disableTypeChecked,
  },
]
