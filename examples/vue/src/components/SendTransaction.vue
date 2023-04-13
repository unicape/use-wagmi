<template>
  <div>
    <div v-if="isLoading">Check Wallet</div>
    <button v-else-if="isIdle" :disabled="isLoading" @click="() => sendTransaction()">
      Send Transaction
    </button>
    <div v-else>
      <div v-if="isSuccess">Transaction: {{ JSON.stringify(data) }}</div>
      <div v-if="isError">Error sending transaction</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { BigNumber } from 'ethers'
import { useSendTransaction } from 'use-wagmi'

const { data, isIdle, isLoading, isSuccess, isError, sendTransaction } = useSendTransaction({
  mode: ref('recklesslyUnprepared'),
  request: {
    to: ref('0xc961145a54C96E3aE9bAA048c4F4D6b04C13916b'),
    value: BigNumber.from('10000000000000000') // 0.01 ETH
  }
})
</script>