<template>
  <div>
    <div>
      {{ data?.formatted }}
      <button @click="() => refetch()">Refetch</button>
    </div>

    <h3>FindBalance</h3>

    <div>
      <input type="text" v-model="walletAddress" placeholder="wallet address">
      <button @click="() => walletRefetch()">{{ walletAddress && isLoading ? 'fetching...' : 'fetch' }}</button>
      <div>{{ walletData?.formatted }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useAccount, useBalance } from 'use-wagmi'

const { address } = useAccount()
const { data, refetch } = useBalance({ address, watch: true })

const walletAddress = ref()
const { data: walletData, isLoading, refetch: walletRefetch } = useBalance({ address: walletAddress })
</script>