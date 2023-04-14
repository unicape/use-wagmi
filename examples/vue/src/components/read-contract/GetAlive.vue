<template>
  <div>
    Is wagmigotchi alive?: <span v-if="isSuccess">{{ alive ? 'yes' : 'no' }}</span>
    <button :disabled="isRefetching" style="margin-left: 4px;" @click="() => aliveRefetch()">
      {{  isRefetching ? 'loading...' : 'refetch'  }}
    </button>
  </div>
</template>

<script lang="ts" setup>
import { useContractRead } from 'use-wagmi'

import { wagmigotchiAbi } from '../wagmigotchi-abi'

const wagmigotchiContractConfig = {
  address: '0xecb504d39723b0be0e3a9aa33d646642d1051ee1' as const,
  abi: wagmigotchiAbi,
}

const { data: alive, isRefetching, isSuccess, refetch: aliveRefetch } = useContractRead({
  ...wagmigotchiContractConfig,
  functionName: 'getAlive'
})
</script>