import { createApp } from 'vue'
import App from './App.vue'

import { createWagmi, configureChains } from 'use-wagmi'
import { avalanche, goerli, mainnet, optimism } from 'use-wagmi/chains'

import { alchemyProvider, infuraProvider, publicProvider } from 'use-wagmi/providers'

import {
  InjectedConnector,
  MetaMaskConnector,
  WalletConnectConnector,
  CoinbaseWalletConnector,
  LedgerConnector,
  SafeConnector
} from 'use-wagmi/connectors'

const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, goerli, optimism, avalanche],
  [
    alchemyProvider({ apiKey: '' }),
    infuraProvider({ apiKey: '' }),
    publicProvider()
  ],
  { targetQuorum: 1 }
)

const wagmi = createWagmi({
  autoConnect: true,
  provider,
  webSocketProvider,
  connectors: [
    new MetaMaskConnector({
      chains,
      options: { UNSTABLE_shimOnConnectSelectAccount: true }
    }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'use-wagmi'
      }
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true
      }
    }),
    new LedgerConnector({
      chains
    }),
    new InjectedConnector({
      chains,
      options: {
        name: (detectedName) => `Inject (${ typeof detectedName === 'string' ? detectedName : detectedName.join(', ') })`,
        shimDisconnect: true
      }
    }),
    new SafeConnector({
      chains,
      options: {
        allowedDomains: [/https:\/\/app.safe.global$/],
        debug: false,
      }
    })
  ]
})

const app = createApp(App)
app.use(wagmi)
app.mount('#app')
