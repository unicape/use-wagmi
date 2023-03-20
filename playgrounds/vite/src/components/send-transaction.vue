<template>
  <div>
    <div v-if="isLoading">Check Wallet</div>
    <div v-if="isIdle">
      <button :disabled="isLoading" @click="() => sendTransaction()">Send Transaction</button>
    </div>
    <div v-if="isSuccess">Transaction: {{ data }}</div>
    <div v-if="isError">Error sending transaction</div>
  </div>
</template>

<script lang="ts" setup>
import { BigNumber } from 'ethers'
import { useSendTransaction } from 'use-wagmi'

const { data, isIdle, isLoading, isError, isSuccess, sendTransaction } = useSendTransaction({
  mode: 'recklesslyUnprepared',
  request: {
    to: '0xc961145a54C96E3aE9bAA048c4F4D6b04C13916b',
    value: BigNumber.from('10000000000000000') // 0.01 ETH
  }
})
</script>