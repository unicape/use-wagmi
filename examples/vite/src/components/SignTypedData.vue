<template>
  <div>
    <button
      :disabled="isLoading"
      @click="() => signTypedData()"
    >
      {{ isLoading ? 'Check Wallet' : 'Sign Message' }}
    </button>

    <div v-if="data">
      <div>signature {{ data }}</div>
      <div>recovered address {{ recoveredAddress }}</div>
    </div>

    <div>{{ error && (error?.message ?? 'Failed to sign message') }}</div>
  </div>
</template>

<script lang="ts" setup>
import { computedAsync } from '@vueuse/core'
import { useSignTypedData } from 'use-wagmi'
import { recoverTypedDataAddress } from 'viem'
import type { Address } from 'use-wagmi'

const domain = {
  name: 'Ether Mail',
  version: '1',
  chainId: 1,
  verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
} as const

// The named list of all type definitions
const types = {
  Person: [
    { name: 'name', type: 'string' },
    { name: 'wallet', type: 'address' },
  ],
  Mail: [
    { name: 'from', type: 'Person' },
    { name: 'to', type: 'Person' },
    { name: 'contents', type: 'string' },
  ],
} as const

const message = {
  from: {
    name: 'Cow',
    wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
  },
  to: {
    name: 'Bob',
    wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
  },
  contents: 'Hello, Bob!',
} as const

const { data, error, isLoading, signTypedData } = useSignTypedData({
  domain,
  types,
  message,
  primaryType: 'Mail'
})

const recoveredAddress = computedAsync<Address | undefined>(async () => {
  if (!data.value) return
  const result = await recoverTypedDataAddress({
    domain,
    types,
    message,
    primaryType: 'Mail',
    signature: data.value,
  })
  return result
}, undefined)
</script>