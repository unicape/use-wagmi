<template>
  <div>
    <div>Mint a wagmi:</div>
    <button
      type='button'
      :disabled="isLoading"
      @click="() => write?.()"
    >
      Mint
    </button>

    <div v-if="isError">{{ error?.message }}</div>
    <div v-if="isSuccess">Transaction hash: {{ data?.hash }}</div>
  </div>
</template>

<script lang="ts" setup>
import { useContractWrite, usePrepareContractWrite } from 'use-wagmi'

import { wagmiContractConfig } from './contracts'

const { config } = usePrepareContractWrite({
  ...wagmiContractConfig,
  functionName: 'mint'
})

const { write, data, error, isLoading, isError, isSuccess } = useContractWrite(config)
</script>