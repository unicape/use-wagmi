<template>
  <div>
    <h1>Account</h1>
    
    <p>{{ address }}</p>
    <button v-if="address" @click="() => disconnect()">Disconnect</button>
    <p v-if="connector?.name">Connected to {{ connector?.name }}</p>

    <h3>Balance</h3>
    <Balance />

    <h3>BlockNumber</h3>
    <BlockNumber />
  </div>
</template>

<script lang="ts" setup>
import { useAccount, useDisconnect } from 'use-wagmi'
import Balance from './balance.vue'
import BlockNumber from './block-number.vue'

const { address, connector } = useAccount({
  onConnect: (data) => console.log('connected', data),
  onDisconnect: () => console.log('disconnected')
})

const { disconnect } = useDisconnect()
</script>