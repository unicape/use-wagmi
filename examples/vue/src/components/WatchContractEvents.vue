<template>
  <div>
    <details>
      <summary>{{ usdcLogs.length }} USDC `Transfer`s logged</summary>
      {{ usdcLogs.reverse().map(log => stringify(log)).join('\n\n\n\n') }}
    </details>

    <details>
      <summary>{{ wagmiLogs.length }} wagmi `Transfer`s logged</summary>
      {{ wagmiLogs.reverse().map(log => stringify(log)).join('\n\n\n\n') }}
    </details>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { Log } from 'viem'
import { stringify } from 'viem'
import { useContractEvent } from 'use-wagmi'

import { usdcContractConfig, wagmiContractConfig } from './contracts'

const usdcLogs = ref<Log[]>([])
useContractEvent({
  ...usdcContractConfig,
  eventName: 'Transfer',
  listener: (logs) => usdcLogs.value.push(...logs)
})

const wagmiLogs = ref<Log[]>([])
useContractEvent({
  ...wagmiContractConfig,
  eventName: 'Transfer',
  listener: (logs) => wagmiLogs.value.push(...logs)
})
</script>