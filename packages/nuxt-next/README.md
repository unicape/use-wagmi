# @use-wagmi/nuxt

[![NPM version](https://img.shields.io/npm/v/@use-wagmi/nuxt?color=a1b858)](https://www.npmjs.com/package/@use-wagmi/nuxt)

## Features

<!-- Highlight some of the features your module provide here -->
- ⛰ &nbsp;Auto-imports `wagmi` composables in your Nuxt app
- 🚠 &nbsp;Automatically installs the required dependencies
- 🌲 &nbsp;Allows you to control the wagmi config centrally in your `nuxt.config.ts`
- 🌳 &nbsp;Provides a runtime `$wagmiConfig` variable to use in your components

> **Warning**
It currently only supports client-side use 

## Quick setup
1. Add `@use-wagmi/nuxt-next` dependency to your project:

```bash
# Using pnpm
pnpm add -D @use-wagmi/nuxt-next

# Using yarn
yarn add --dev @use-wagmi/nuxt-next

# Using npm
npm install --save-dev @use-wagmi/nuxt-next
```

2. Add `@use-wagmi/nuxt-next` to the `modules` section of `nuxt.config.ts`:

```ts
// nuxt.config
export default defineNuxtConfig({
  modules: [
    '@use-wagmi/nuxt-next',
  ],
})
```

And done, you are ready to use `use-wagmi` in your Nuxt app ✨

## Usage
1. Specify in your `nuxt.config.ts` how you want to configure `wagmi`:
  
```ts
// nuxt.config
export default defineNuxtConfig({
  modules: [
    '@use-wagmi/nuxt-next',
  ],
  useWagmi: {
    // Specify other wagmi options here...
    config: {
      chains: [mainnet, sepolia],
      transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
      },
    },
  }
})
```

2. Then, use the config freely in your components
```vue
<template>
  <h1> My Config: </h1>
  <ClientOnly>
    <pre>
    {{ $wagmiConfig }}
  </pre>
  </ClientOnly>
</template>

<script setup>
const { $wagmiConfig } = useNuxtApp()
</script>

```


## Development

```bash
# Install dependencies
pnpm install

# Generate type stubs
pnpm dev:prepare

# Develop with the playground
pnpm dev

# Build the playground
pnpm dev:build

# Run ESLint
pnpm lint

# Run Vitest (todo)
pnpm test
pnpm test:watch

# Release new version (todo)
pnpm release
```

## License

[MIT License](https://github.com/unicape/use-wagmi/blob/main/LICENSE) Copyright (c) 2022 Robert Soriano <https://github.com/unicape>
