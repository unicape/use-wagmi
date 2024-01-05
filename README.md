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
npm install use-wagmi viem @tanstack/vue-query
```

## Create Config

Create and export a new Wagmi config using **createConfig**.

```ts
import { http, createConfig } from 'use-wagmi'
import { mainnet, sepolia } from 'use-wagmi/chains'

export const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})
```

In this example, Wagmi is configured to use the Mainnet and Sepolia chains, and **injected** connector. Check out the **createConfig** [docs](https://wagmi.sh/react/api/createConfig) for more configuration options.

## Use Wagmi Initialization

Before using Vue Query, you need to initialize it using `UseWagmiPlugin`

```ts
import { UseWagmiPlugin } from 'use-wagmi'

app.use(VueQueryPlugin, vueQueryOptions, { config })
```

## Use of Composition API with `<script setup>`

All examples in our documentation use `<script setup>` syntax.

Vue 2 users can also use that syntax using this plugin. Please check the plugin documentation for installation details.

If you are not a fan of `<script setup>` syntax, you can easily translate all the examples into normal Composition API syntax by moving the code under `setup()` function and returning the values used in the template.

```vue
<script setup>
import { useAccount, useDisconnect } from 'use-wagmi'

const { address, chainId, status } = useAccount()
const { disconnect } = useDisconnect()
</script>

<template>
  <div>
    <h2>Account</h2>
    <div>
      account: {{ address }}
      chainId: {{ chainId }}
      status: {{ status }}
    </div>

    <button v-if="status !== 'disconnected'" type="button" @click="() => disconnect()">Disconnect</button>
  </div>
</template>
```

## Nuxt

we provide the [@use-wagmi/nuxt](https://github.com/unicape/use-wagmi/tree/main/packages/nuxt) module. This module enables automatic importing of wagmi functionality into your Nuxt application.

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
