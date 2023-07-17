import { defineConfig } from 'tsup'

import { getConfig } from '../../scripts/tsup'
import { dependencies } from './package.json'

export default defineConfig(
  getConfig({
    banner: {
      js: '"use client";',
    },
    dev: process.env.DEV === 'true',
    entry: [
      'src/index.ts',
    ],
    external: [...Object.keys(dependencies)],
    platform: 'browser',
  }),
)
