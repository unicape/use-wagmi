<template>
  <div>
    <div>
      Is wagmigotchi alive?: <span v-if="isSuccess">{{ data ? 'yes' : 'no' }}</span>
      <button :disabled="isRefetching" @click="() => refetch()">
        {{ isRefetching ? 'loading...' : 'refetch' }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useContractRead, useProvider } from 'use-wagmi'
import { wagmigotchiAbi } from './wagmigotchi-abi'

const wagmigotchiContractConfig = {
  address: '0xecb504d39723b0be0e3a9aa33d646642d1051ee1' as const,
  abi: wagmigotchiAbi,
}

const { data, isRefetching, isSuccess, refetch } = useContractRead({
  ...wagmigotchiContractConfig,
  functionName: 'getAlive'
})
</script>