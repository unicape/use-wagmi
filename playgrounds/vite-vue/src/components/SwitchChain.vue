<script lang="ts" setup>
import { useChainId, useSwitchChain } from 'use-wagmi'

const chainId = useChainId()
const { chains, switchChain, error } = useSwitchChain()
</script>

<template>
  <div>
    <h2>Switch Chain</h2>

    <button v-for="chain in chains" :disabled="chainId === chain.id" :key="chain.id"
      @click="() => switchChain({ chainId: chain.id })" type="button">
      {{ chain.name }}
    </button>

    {{ error?.message }}
  </div>
</template>