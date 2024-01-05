<script lang="ts" setup>
import { useConnections } from 'use-wagmi'

const connections = useConnections()
</script>

<template>
  <div>
    <h2>Connections</h2>

    <div v-for="connection in connections" :key="connection.connector.uid">
      <div>connector {{ connection.connector.name }}</div>
      <div>accounts: {{ JSON.stringify(connection.accounts) }}</div>
      <div>chainId: {{ connection.chainId }}</div>
    </div>
  </div>
</template>