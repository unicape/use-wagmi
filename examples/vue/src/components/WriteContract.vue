<template>
  <div>
    <div>Mint a wagmi:</div>

    <div>
      <input type="text" v-model="tokenId" placeholder="token id">
      <button @click="() => write({ args: [BigInt(tokenId)] })">Mint</button>

      <div v-if="isError">{{ error?.message }}</div>
      <div v-if="isSuccess">Transaction hash: {{ data?.hash }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useContractWrite } from 'use-wagmi'
import { wagmiContractConfig } from './contracts'

const tokenId = ref('')

const { write, data, error, isLoading, isError, isSuccess } = useContractWrite({
  ...wagmiContractConfig,
  functionName: 'mint',
  chainId: 1,
})
</script>