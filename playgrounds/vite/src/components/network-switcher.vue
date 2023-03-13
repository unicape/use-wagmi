<template>
  <div>
    <div v-if="chain">Useing {{ chain.name }}</div>

    <button
      v-for="x in chains"
      :key="x.id"
      :disabled="!support || x.id === chain?.id"
      @click="() => switchNetwork?.(x.id)"
    >
      Switch to {{ x.name }}
      {{ status === 'loading' && x.id === pendingChainId ? '...' : '' }}
    </button>

    <div>{{ error && (error?.message ?? 'Failed to switch') }}</div>
  </div>
</template>

<script lang="ts" setup>
import { useNetwork, useSwitchNetwork } from 'use-wagmi'

const { chain } = useNetwork()
const { support, chains, error, pendingChainId, switchNetwork, status } = useSwitchNetwork()
</script>