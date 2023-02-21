import { createApp } from 'vue'
import App from './App.vue'
import { createWagmi } from 'use-wagmi'
import { MetaMaskConnector, WalletConnectConnector } from 'use-wagmi/connectors'
import { getDefaultProvider } from 'ethers'

const wagmi = createWagmi({
  autoConnect: true,
  provider: getDefaultProvider(),
  connectors: [
    new MetaMaskConnector(),
    new WalletConnectConnector({
      options: {}
    })
  ]
})

const app = createApp(App)

app.use(wagmi)

app.mount('#app')
