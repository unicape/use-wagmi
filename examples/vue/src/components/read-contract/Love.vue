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
import type { Address } from 'use-wagmi'

import { wagmigotchiAbi } from '../wagmigotchi-abi'

const wagmigotchiContractConfig = {
  address: '0xecb504d39723b0be0e3a9aa33d646642d1051ee1' as const,
  abi: wagmigotchiAbi,
}

const address = ref<Address>('0xA0Cf798816D4b9b9866b5330EEa46a18382f251e')

const { data, isFetching, isRefetching, isSuccess, refetch } = useContractRead({
  ...wagmigotchiContractConfig,
  functionName: 'love',
  args: [address],
  enabled: computed(() => !!address.value),
})
</script>