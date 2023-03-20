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
import { usePrepareSendTransaction, useSendTransaction } from 'use-wagmi'

const { config } = usePrepareSendTransaction({
  request: {
    to: '0x11dc57953bD9C3c61Ba75A183c7140eb6f59866b',
    value: BigNumber.from('10000000000000000')
  }
})

const { data, isIdle, isLoading, isSuccess, isError, sendTransaction } = useSendTransaction(config)
</script>