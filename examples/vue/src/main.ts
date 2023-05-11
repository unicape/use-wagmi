import { UseWagmiPlugin, configureChains, createConfig } from 'use-wagmi'
import { avalanche, goerli, mainnet, optimism } from 'use-wagmi/chains'
import { MetaMaskConnector } from 'use-wagmi/connectors/metaMask'
import { publicProvider } from 'use-wagmi/providers/public'
import { createApp } from 'vue'

import App from './App.vue'

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, goerli, optimism, avalanche],
  [publicProvider()],
)

const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({
      chains,
      options: {
        UNSTABLE_shimOnConnectSelectAccount: true,
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
})

const app = createApp(App)
app.use(UseWagmiPlugin, config)
app.mount('#app')
