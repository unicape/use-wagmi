<template>
  <div>
    Is wagmigotchi alive?: <span v-if="isSuccess">{{ alive ? 'yes' : 'no' }}</span>
    <button :disabled="isRefetching" style="margin-left: 4px;" @click="() => refetch()">
      {{  isRefetching ? 'loading...' : 'refetch'  }}
    </button>
  </div>
</template>

<script lang="ts" setup>
import { useContractRead } from 'use-wagmi'

import { wagmigotchiContractConfig } from '../contracts'

const { data: alive, isRefetching, isSuccess, refetch } = useContractRead({
  ...wagmigotchiContractConfig,
  functionName: 'getAlive'
})
</script>