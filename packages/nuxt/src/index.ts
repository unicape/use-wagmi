import { defineNuxtModule } from '@nuxt/kit'
import type { Import, Preset } from 'unimport'

const packageName = 'use-wagmi' as const

const functions = [
  'configureChains',
  'createConfig',
  'UseWagmiPlugin',
  'useConfig',
  'paginatedIndexesConfig',
  'useAccount',
  'useBalance',
  'useBlockNumber',
  'useChainId',
  'useConnect',
  'useContractEvent',
  'useContractInfiniteReads',
  'useContractRead',
  'useContractReads',
  'useContractWrite',
  'useDisconnect',
  'useEnsAddress',
  'useEnsAvatar',
  'useEnsName',
  'useEnsResolver',
  'useFeeData',
  'useInfiniteQuery',
  'useNetwork',
  'usePublicClient',
  'useQuery',
  'useQueryClient',
  'useSendTransaction',
  'usePrepareContractWrite',
  'usePrepareSendTransaction',
  'useSignMessage',
  'useSignTypedData',
  'useSwitchNetwork',
  'useToken',
  'useTransaction',
  'useWaitForTransaction',
  'useWalletClient',
  'useWatchPendingTransactions',
  'useWebSocketPublicClient',
]

export default defineNuxtModule({
  meta: {
    name: packageName,
    configKey: packageName,
  },
  setup(_, nuxt) {
    nuxt.hook('vite:extend', ({ config }: any) => {
      config.optimizeDeps = config.optimizeDeps || {}
      config.optimizeDeps.exclude = config.optimizeDeps.exclude || []
      config.optimizeDeps.exclude.push(packageName)
    })

    // add packages to transpile target for alias resolution
    nuxt.options.build = nuxt.options.build || {}
    nuxt.options.build.transpile = nuxt.options.build.transpile || []
    nuxt.options.build.transpile.push(packageName)

    nuxt.hook('imports:sources', (sources: (Import | Preset)[]) => {
      if (sources.find(i => (i as Import).from === packageName))
        return

      const imports = functions
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
})