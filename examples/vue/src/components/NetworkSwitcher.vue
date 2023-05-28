<template>
  <div>
    {{ chain && chain.name }}

    <button v-for="x in chains"
      :key="x.id"
      :disabled="!connector?.switchChain || x.id === chain?.id"
      @click="() => switchNetwork?.(x.id)"
    >
      Switch to {{ x.name }}
      {{ status === 'loading' && x.id === pendingChainId ? '…' : '' }}
    </button>
  </div>
</template>

<script lang="ts" setup>
import { useNetwork, useSwitchNetwork, useAccount } from 'use-wagmi'

const { connector } = useAccount()
const { chain } = useNetwork()
const { chains, error, pendingChainId, switchNetwork, status } = useSwitchNetwork()
</script>