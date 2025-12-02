import { nextJsConfig } from '@repo/eslint-config/next-js'

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    ignores: ['*.config.cjs', 'ecosystem.config.cjs'],
  },
  ...nextJsConfig,
]
