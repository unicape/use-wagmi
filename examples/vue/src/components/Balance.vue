<template>
  <div>
    <div>
      {{ accountData?.formatted }}
      <button @click="() => accountRefetch()">fetch</button>
    </div>

    <div>
      Find balance:
      <input v-model="value" placeholder="wallet address" />
      <button @click="() => findRefetch()">
        {{ isLoading ? 'fetching...' : 'fetch' }}
      </button>
      <div>{{ findData?.formatted }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useAccount, useBalance } from 'use-wagmi'

import type { Address } from 'use-wagmi'

const { address } = useAccount()
const { data: accountData, refetch: accountRefetch } = useBalance({
  address,
  watch: true
})

const value = ref<Address>()
const { data: findData, refetch: findRefetch, isLoading } = useBalance({
  address: value
})
</script>