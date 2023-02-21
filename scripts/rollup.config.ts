import dts from 'rollup-plugin-dts'
import esbuild from 'rollup-plugin-esbuild'
import { packages } from '../meta/packages'

import type { RollupOptions, OutputOptions } from 'rollup'

const configs: RollupOptions[] = []

const pluginEsbuild = esbuild()
const pluginDts = dts()

const externals = [
  'vue-demi',
  'vue-query',
  '@wagmi/core'
]

for (const { build, name, external, mjs, cjs } of packages) {
  if (build === false) continue

  const input = `src/${name}/index.ts`
  const output: OutputOptions[] = []

  if (mjs !== false) {
    output.push({
      file: `dist/${name}/index.mjs`,
      format: 'es',
      exports: 'named'
    })
  }

  if (cjs !== false) {
    output.push({
      file: `dist/${name}/index.cjs`,
      format: 'cjs',
      exports: 'named'
    })
  }

  output.length && configs.push({
    input,
    output,
    plugins: [
      pluginEsbuild
    ],
    external: [
      ...externals,
      ...(external || [])
    ]
  })

  configs.push({
    input,
    output: {
      file: `dist/${name}/index.d.ts`,
      format: 'es'
    },
    plugins: [
      pluginDts
    ],
    external: [
      ...externals,
      ...(external || [])
    ]
  })
}

export default configs