import { defineNuxtModule } from '@nuxt/kit'
import * as functions from 'use-wagmi'
import type { Import, Preset } from 'unimport'

const packageName = 'use-wagmi' as const
const gitignore = ['mainnet', 'sepolia']

export interface WagmiNuxtOptions {
  /**
   * @default true
   */
  autoImports?: boolean
}

export default defineNuxtModule<WagmiNuxtOptions>({
  meta: {
    name: packageName,
    configKey: packageName,
  },
  defaults: {
    autoImports: true,
  },
  setup(options, nuxt) {
    // add packages to transpile target for alias resolution
    nuxt.options.build = nuxt.options.build || {}
    nuxt.options.build.transpile = nuxt.options.build.transpile || []
    nuxt.options.build.transpile.push(packageName)

    if (options.autoImports) {
      nuxt.hook('imports:sources', (sources: (Import | Preset)[]) => {
        if (sources.find(i => (i as Import).from === packageName))
          return
  
        const imports = Object.keys(functions)
          .filter(name => !gitignore.includes(name))
          .map((i): Import => {
            return {
              from: packageName,
              name: i,
              as: i,
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
  }
})

declare module '@nuxt/schema' {
  interface NuxtConfig {
    wagmi?: WagmiNuxtOptions
  }
  interface NuxtOptions {
    wagmi?: WagmiNuxtOptions
  }
}