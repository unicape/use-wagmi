<template>
  <div>
    <h1>Account</h1>
    
    <p>{{ address }}</p>
    <button v-if="address" @click="() => disconnect()">Disconnect</button>
    <p v-if="connector?.name">Connected to {{ connector?.name }}</p>

    <template v-if="false">
      <h3>Balance</h3>
      <Balance />
    </template>

    <template v-if="false">
      <h3>BlockNumber</h3>
      <BlockNumber />

      <h3>SendTransaction</h3>
      <SendTransaction />

      <h3>SendTransactionPrepared</h3>
      <SendTransactionPrepared />
    </template>

    <h4>Read Contract</h4>
    <ReadContract />
  </div>
</template>

<script lang="ts" setup>
import { useAccount, useDisconnect } from 'use-wagmi'
import Balance from './balance.vue'
import BlockNumber from './block-number.vue'
import SendTransaction from './send-transaction.vue'
import SendTransactionPrepared from './send-transaction-prepared.vue'
import ReadContract from './read-contract.vue'

const { address, connector } = useAccount({
  onConnect: (data) => console.log('connected', data),
  onDisconnect: () => console.log('disconnected')
})

const { disconnect } = useDisconnect()
</script>