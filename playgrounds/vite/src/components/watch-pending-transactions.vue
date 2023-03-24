<template>
  <div>
    <div>watching...</div>
    <div v-for="tx in transactions">
      {{ JSON.stringify(tx) }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useWatchPendingTransactions } from 'use-wagmi'

import type { Transaction } from 'ethers'

const transactions = ref<Transaction[]>([])

useWatchPendingTransactions({
  listener: (tx) => transactions.value.push(tx)
})
</script>