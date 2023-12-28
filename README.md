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

Install use-wagmi and its [viem](https://viem.sh) peer dependency.

```bash
npm install use-wagmi viem
```

## Quick Start

Connect a wallet in under 60 seconds.

```ts
import { UseWagmiPlugin, createConfig, mainnet } from 'use-wagmi'
import { createPublicClient, http } from 'viem'
import App from './App.vue'

const config = createConfig({
  autoConnect: true,
  publicClient: createPublicClient({
    chain: mainnet,
    transport: http(),
  }),
})

const app = createApp(App)
app.use(UseWagmiPlugin, config)
app.mount('#app')
```

```html
<script setup>
  import { useAccount, useConnect, useDisconnect } from 'use-wagmi'
  import { InjectedConnector } from 'use-wagmi/connectors/injected'

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
  <button v-else @click="connect">Connect Wallet</button>
</template>
```

In this example, we create a `use-wagmi` and pass it to the Vue plugin. The client is set up to use the ethers Default Provider and automatically connect to previously connected wallets.

Next, we use the `useConnect` composable to connect an injected wallet (e.g. MetaMask) to the app. Finally, we show the connected account's address with `useAccount` and allow them to disconnect with `useDisconnect`.

We've only scratched the surface for what you can do with use-wagmi!

## Integrating use-wagmi with Nuxt 3 and Nuxt Bridge

To simplify the process of integrating wagmi (Web3 hooks library) with Nuxt 3 or Nuxt Bridge, we provide the `@use-wagmi/nuxt` module. This module enables automatic importing of wagmi functionality into your Nuxt application.

### Installation

First, install the `@use-wagmi/nuxt` module in your project:

```bash
npm install @use-wagmi/nuxt -D
```

### Configuration

Next, add the module to your Nuxt configuration:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@use-wagmi/nuxt'],
})
```

This registers `@use-wagmi/nuxt` as a module in your Nuxt application.

### Setting Up use-wagmi in Your Application

In your main Vue file (typically `app.vue`), set up use-wagmi with your desired configuration:

```html
<!-- app.vue -->
<script setup lang="ts">
import { UseWagmiPlugin, createConfig, mainnet } from 'use-wagmi';
import { createPublicClient, http } from 'viem';

const nuxtApp = useNuxtApp();
const config = createConfig({
  autoConnect: true,
  publicClient: createPublicClient({
    chain: mainnet,
    transport: http(),
  }),
});

nuxtApp.vueApp.use(UseWagmiPlugin, config);
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

This script sets up the wagmi configuration and registers it with your Nuxt application.

### Using use-wagmi in Components

After setting up, you can use wagmi functions anywhere in your Nuxt application. For instance, to access the connected account's address:

```html
<script setup lang="ts">
  import { useAccount } from 'use-wagmi';

  const { address } = useAccount();
</script>

<template>
  <div>{{ address }}</div>
</template>
```

In this example, `useAccount` from wagmi is used to get the address of the connected account, which is then rendered in the template.

## Support

If you find `use-wagmi` useful, please consider supporting development. Thank you 🙏

ERC20-USDT: 0xb493c9555f5c2be907a3bfa363daf1fc22635fe5<br />TRC20-USDT: TLXcmNCTSngBXMxzmkZVHFdWE3XHEK5bBi

> Please do not send other assets except USDT

## Credits

- [wagmi.sh](https://wagmi.sh/)
- [VueUse](https://vueuse.org/)
- [Vue Query](https://vue-query.vercel.app/)

## License

MIT
