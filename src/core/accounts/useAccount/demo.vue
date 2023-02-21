<template>
  <div>
    <p>status: {{ status }}</p>
    <p>address: {{ address }}</p>
    <p>isConnecting: {{ isConnecting }}</p>
    <p>isConnected: {{ isConnected }}</p>
    <p>isReconnecting: {{ isReconnecting }}</p>
    <p>isDisconnected: {{ isDisconnected }}</p>
  </div>
</template>

<script lang="ts" setup>
import { useAccount } from 'use-wagmi/core'

const {
  status,
  address,
  isConnecting,
  isConnected,
  isReconnecting,
  isDisconnected,
  connector
} = useAccount({
  onConnect (data) {
    // onConnect
  },
  onDisconnect () {
    // onDisconnect
  }
})

console.log(connector);
</script>