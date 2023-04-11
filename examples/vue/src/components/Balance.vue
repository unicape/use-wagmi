<template>
  <div>
    <div>
      {{ accountBalance?.formatted }}
      <button @click="() => accountRefetch()">fetch</button>
    </div>

    <div>
      Find balance:
      <input v-model="value" placeholder="wallet address" />
      <button>
        {{ isLoading ? 'fetching...' : 'fetch' }}
      </button>
      <div>{{ findBalance?.formatted }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useAccount, useBalance } from 'use-wagmi'

import type { Address } from 'use-wagmi'

const { address } = useAccount()
const { data: accountBalance, refetch: accountRefetch } = useBalance({
  address,
  watch: true
})

const value = ref<Address>()
const { data: findBalance, refetch: findRefetch, isLoading } = useBalance({
  address: value,
  watch: false
})
</script>