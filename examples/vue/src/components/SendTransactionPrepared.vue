<template>
  <div>
    <div v-if="isLoading">Check Wallet</div>
    <button v-else-if="isIdle" :disabled="isLoading" @click="() => sendTransaction()">
      Send Transaction
    </button>
    <div v-else>
      <div v-if="isSuccess">Transaction: {{ stringify(data) }}</div>
      <div v-if="isError">Error sending transaction</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { stringify, parseEther } from 'viem'
import { usePrepareSendTransaction, useSendTransaction } from 'use-wagmi'

const { config } = usePrepareSendTransaction({
  to: '0xc961145a54C96E3aE9bAA048c4F4D6b04C13916b',
  value: parseEther('0.01'),
})

const { data, isIdle, isLoading, isSuccess, isError, sendTransaction } = useSendTransaction(config)
</script>