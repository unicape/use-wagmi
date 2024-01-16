import { addPlugin, createResolver, defineNuxtModule } from '@nuxt/kit'
import { defu } from 'defu'
import { camelCase } from 'scule'
import { createConfig } from 'use-wagmi'
import { functions } from './functions.js'

const packageName = 'use-wagmi' as const
export const configKey = camelCase(packageName)

export interface WagmiNuxtOptions {
  /**
   * @default true
   */
  autoImports?: boolean
  /**
   * List of imports to exclude from auto-imports
   */
  excludeImports?: string[]
  /**
   * Wagmi configuration object
   */
  config?: Parameters<typeof createConfig>
}

export default defineNuxtModule<WagmiNuxtOptions>({
  meta: {
    name: packageName,
    configKey,
    compatibility: {
      nuxt: '^3.0.0 || ^2.16.0',
      bridge: true,
    },
  },
  defaults: {
    autoImports: true,
    excludeImports: [],
    config: undefined,
  },
  setup(options, nuxt) {
    // add packages to transpile target for alias resolution
    nuxt.options.build = (nuxt.options.build || {}) as any
    nuxt.options.build.transpile = nuxt.options.build.transpile || []
    nuxt.options.build.transpile.push(packageName)

    const exclude = nuxt.options.wagmi?.excludeImports || []
    if (options.autoImports) {
      nuxt.hook('imports:sources', (sources) => {
        if (sources.find((i) => i.from === packageName)) return

        const imports = functions
          .filter((name: string) => !exclude.includes(name))
          .map((name: string) => {
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

    if (options.config) {
      const { resolve } = createResolver(import.meta.url)

      nuxt.options.runtimeConfig.public[configKey] = defu(
        nuxt.options.runtimeConfig.public[configKey] as object,
        {
          config: options.config,
        },
      )
      addPlugin(resolve('./runtime/plugin.ts'))
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
