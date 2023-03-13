<template>
  <div>
    <h1>Account</h1>
    
    <p>{{ address }}</p>
    <button v-if="address" @click="() => disconnect()">Disconnect</button>
    <p v-if="connector?.name">Connected to {{ connector?.name }}</p>

    <Balance />
  </div>
</template>

<script lang="ts" setup>
import Balance from './balance.vue'
import { useAccount, useDisconnect } from 'use-wagmi'

const { address, connector } = useAccount({
  onConnect: (data) => console.log('connected', data),
  onDisconnect: () => console.log('disconnected')
})

const { disconnect } = useDisconnect()
</script>