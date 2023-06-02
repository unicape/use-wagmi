<template>
  <div>
    <details>
      <summary>{{ list.length }} hashes logged</summary>
      {{ list.reverse().join('\n') }}
    </details>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useWatchPendingTransactions } from 'use-wagmi'

import type { Hex } from 'viem'

const list = ref<Hex[]>([])

useWatchPendingTransactions({
  listener: (hashes) => list.value.push(...hashes)
})
</script>