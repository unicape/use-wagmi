import { UseWagmiPlugin, configureChains, createConfig } from 'use-wagmi'
import { avalanche, goerli, mainnet, optimism } from 'use-wagmi/chains'

import { CoinbaseWalletConnector } from 'use-wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'use-wagmi/connectors/injected'
import { LedgerConnector } from 'use-wagmi/connectors/ledger'
import { MetaMaskConnector } from 'use-wagmi/connectors/metaMask'
import { SafeConnector } from 'use-wagmi/connectors/safe'
import { WalletConnectConnector } from 'use-wagmi/connectors/walletConnect'
import { WalletConnectLegacyConnector } from 'use-wagmi/connectors/walletConnectLegacy'

import { alchemyProvider } from 'use-wagmi/providers/alchemy'
import { infuraProvider } from 'use-wagmi/providers/infura'
import { publicProvider } from 'use-wagmi/providers/public'

import { createApp } from 'vue'

import App from './App.vue'

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, goerli, optimism, avalanche],
  [
    alchemyProvider({ apiKey: '' }), //TODO: your API Key
    infuraProvider({ apiKey: '' }), //TODO: your API Key
    publicProvider(),
  ],
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
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'use-wagmi',
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: '', //TODO: your project ID
      },
    }),
    new WalletConnectLegacyConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
    new LedgerConnector({
      chains,
      options: {
        projectId: '', //TODO: your project ID
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: (detectedName) =>
          `Injected (${
            typeof detectedName === 'string'
              ? detectedName
              : detectedName.join(', ')
          })`,
        shimDisconnect: true,
      },
    }),
    new SafeConnector({
      chains,
      options: {
        allowedDomains: [/https:\/\/app.safe.global$/],
        debug: false,
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
})

const app = createApp(App)
app.use(UseWagmiPlugin, config)
app.mount('#app')
