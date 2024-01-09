import { http, UseWagmiPlugin, createConfig } from 'use-wagmi'
import { celo, mainnet, optimism, sepolia } from 'use-wagmi/chains'
import { coinbaseWallet, walletConnect } from 'use-wagmi/connectors'

export default defineNuxtPlugin((nuxt) => {
  const runtimeConfig = useRuntimeConfig()

  const config = createConfig({
    chains: [mainnet, sepolia, optimism, celo],
    connectors: [
      walletConnect({
        projectId: runtimeConfig.public.VITE_WC_PROJECT_ID as string,
      }),
      coinbaseWallet({ appName: 'Vite Vue Playground', darkMode: true }),
    ],
    transports: {
      [mainnet.id]: http(
        'https://eth-mainnet.g.alchemy.com/v2/StF61Ht3J9nXAojZX-b21LVt9l0qDL38',
      ),
      [sepolia.id]: http(
        'https://eth-sepolia.g.alchemy.com/v2/roJyEHxkj7XWg1T9wmYnxvktDodQrFAS',
      ),
      [optimism.id]: http(),
      [celo.id]: http(),
    },
  })

  nuxt.vueApp.use(UseWagmiPlugin, { config })
})
