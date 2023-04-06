<template>
  <WagmiConfig :client="client">
    <Connect />
  </WagmiConfig>
</template>

<script setup lang="ts">
import { WagmiConfig, configureChains, createClient } from 'use-wagmi'
import { avalanche, goerli, mainnet, optimism } from 'use-wagmi/chains'
import { MetaMaskConnector } from 'use-wagmi/connectors/metaMask'
import { publicProvider } from 'use-wagmi/providers/public'

import Connect from './components/Connect.vue'

const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, goerli, optimism, avalanche],
  [
    publicProvider()
  ],
  { targetQuorum: 1 }
)

const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({
      chains,
      options: {
        UNSTABLE_shimOnConnectSelectAccount: true
      }
    })
  ],
  provider,
  webSocketProvider
})
</script>

<style scoped>
</style>
