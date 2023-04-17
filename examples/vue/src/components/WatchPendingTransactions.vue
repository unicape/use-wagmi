<template>
  <div>
    <div>watching...</div>
    <div v-for="item in list" :key="JSON.stringify(item)">{{ JSON.stringify(item) }}</div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { Transaction } from 'ethers'
import { useWatchPendingTransactions } from 'use-wagmi'

const list = ref<Transaction[]>([])

useWatchPendingTransactions({
  listener: (tx) => {
    console.log(tx)
    list.value.push(tx)
  }
})
</script>