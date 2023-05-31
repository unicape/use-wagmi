<template>
  <div>
    Get wagmigotchi love:
    <input type="text" style="margin-left: 4px;" v-model="address" placeholder="wallet address">
    <button @click="() => refetch()">
      {{ isFetching ? isRefetching ? 'refetching...' : 'fetching' : 'fetch' }}
    </button>
    <div v-if="isSuccess">{{ data?.toString() }}</div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useContractRead } from 'use-wagmi'
import { wagmigotchiContractConfig } from '../contracts'

import type { Address } from 'use-wagmi'

const address = ref<Address>('0xA0Cf798816D4b9b9866b5330EEa46a18382f251e')

const { data, isFetching, isRefetching, isSuccess, refetch } = useContractRead({
  ...wagmigotchiContractConfig,
  functionName: 'love',
  args: [address],
  enabled: computed(() => !!address.value),
})
</script>