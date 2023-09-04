import { defineNuxtModule } from '@nuxt/kit'
import { functions } from './functions'

const packageName = 'use-wagmi' as const

export interface WagmiNuxtOptions {
  /**
   * @default true
   */
  autoImports?: boolean
  /**
   * List of imports to exclude from auto-imports
   */
  excludeImports?: string[]
}

export default defineNuxtModule<WagmiNuxtOptions>({
  meta: {
    name: packageName,
    configKey: packageName,
    compatibility: {
      nuxt: '^3.0.0 || ^2.16.0',
      bridge: true,
    },
  },
  defaults: {
    autoImports: true,
    excludeImports: [],
  },
  setup(options, nuxt) {
    // add packages to transpile target for alias resolution
    nuxt.options.build = nuxt.options.build || {}
    nuxt.options.build.transpile = nuxt.options.build.transpile || []
    nuxt.options.build.transpile.push(packageName)

    const exclude = nuxt.options.wagmi?.excludeImports || []
    if (options.autoImports) {
      nuxt.hook('imports:sources', (sources) => {
        if (sources.find((i) => i.from === packageName)) return

        const imports = Object.keys(functions)
          .filter((name) => !exclude.includes(name))
          .map((name) => {
            return {
              from: packageName,
              name,
              as: name,
              priority: -1,
            }
          })

        sources.push({
          from: packageName,
          imports,
          priority: -1,
        })
      })
    }
  },
})

declare module '@nuxt/schema' {
  interface NuxtConfig {
    wagmi?: WagmiNuxtOptions
  }
  interface NuxtOptions {
    wagmi?: WagmiNuxtOptions
  }
}
