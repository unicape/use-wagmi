<template>
  <div>
    <div v-if="isLoading">Check Wallet</div>
    <button v-else-if="isIdle" :disabled="isLoading && !disabled" @click="() => sendTransaction()">
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
import { useSendTransaction } from 'use-wagmi'

const { data, isIdle, isLoading, isSuccess, isError, disabled, sendTransaction } = useSendTransaction({
  to: '0xc961145a54C96E3aE9bAA048c4F4D6b04C13916b',
  value: parseEther('0.01')
})
</script>