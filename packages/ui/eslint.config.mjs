import { config } from '@repo/eslint-config/react-internal'
import tseslint from 'typescript-eslint'

/** @type {import("eslint").Linter.Config} */
export default [
  ...config,
  {
    files: ['eslint.config.mjs'],
    ...tseslint.configs.disableTypeChecked,
  },
]
