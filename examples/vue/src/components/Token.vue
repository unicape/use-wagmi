<template>
  <div>
    <div v-if="isLoading">Fetching token…</div>
    <div v-else-if="isError">Error fetching token</div>
    <div v-else>
      totalSupply: {{ data?.totalSupply?.formatted }} {{  data?.symbol }}
      <div>
        <input v-model="address" placeholder="token address">
        <button @click="() => refetch()">fetch</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useToken } from 'use-wagmi'
import type { Address } from 'use-wagmi'

const address = ref<Address>('0x1f9840a85d5af5bf1d1762f925bdaddc4201f984')

const { data, isError, isLoading, refetch } = useToken({ address })
</script>