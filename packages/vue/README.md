[![npm (tag)](https://img.shields.io/npm/v/use-wagmi?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/use-wagmi) ![NPM](https://img.shields.io/npm/l/use-wagmi?style=flat&colorA=000000&colorB=000000)

# use-wagmi

Vue Composition for Ethereum

Support for Vue 2.x via [vue-demi](https://github.com/vueuse/vue-demi)

Based on [wagmi](https://wagmi.sh)

## Features

- 🚀 Composables for working with wallets, ENS, contracts, transactions, signing, etc.
- 💼 Built-in wallet connectors for MetaMask, WalletConnect, Coinbase Wallet, and Injected
- 👟 Caching, request deduplication, multicall, batching, and persistence
- 🌀 Auto-refresh data on wallet, block, and network changes
- 🦄 TypeScript ready

...and a lot more.

## Documentation

`use-wagmi docs` visit [wagmi docs](https://wagmi.sh) as most of the concepts and APIs are the same.

## Installation

Install use-wagmi and its ethers peer dependency.

```bash
npm install use-wagmi viem
```

## Quick Start

Connect a wallet in under 60 seconds.

```ts
import { UseWagmiPlugin, WagmiConfig, createConfig, mainnet } from 'use-wagmi'
import { createPublicClient, http } from 'viem'
import App from './App.vue'

const config = createConfig({
  autoConnect: true,
  publicClient: createPublicClient({
    chain: mainnet,
    transport: http(),
  }),
})

const app = createApp(App);
app.use(UseWagmiPlugin, config);
app.mount('#app');
```

```html
<script setup>
import { useAccount, useConnect, useDisconnect } from 'use-wagmi'
import { InjectedConnector } from 'use-wagmi/connectors'

const { address, isConnected } = useAccount()
const { connect } = useConnect({
  connector: new InjectedConnector(),
})
const { disconnect } = useDisconnect()
</script>

<template>
  <div v-if="isConnected">
    Connected to {{ address }}
    <button @click="disconnect">Disconnect</button>
  </div>
  <button v-else @click="connect">
    Connect Wallet
  </button>
</template>
```

In this example, we create a use-wagmi `wagmi` and pass it to the Vue plugin. The client is set up to use the ethers Default Provider and automatically connect to previously connected wallets.

Next, we use the `useConnect` composable to connect an injected wallet (e.g. MetaMask) to the app. Finally, we show the connected account's address with `useAccount` and allow them to disconnect with `useDisconnect`.

We've only scratched the surface for what you can do with use-wagmi!

## Credits

- [wagmi.sh](https://wagmi.sh/)
- [VueUse](https://vueuse.org/)
- [Vue Query](https://vue-query.vercel.app/)

## License

MIT
