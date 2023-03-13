<template>
  <div>
    <h1>Connect</h1>
    
    <div>
      <button
        v-for="x in connectors" :key="x.id"
        :disabled="!x.ready || isReconnecting || connector?.id === x.id"
        @click="connect({ connector: x })"
      >
        {{ x.name }}
        {{ !x.ready ? ' (unsupported)' : '' }}
        {{ isLoading && x.id === pendingConnector?.id ? '...' : '' }}
      </button>
    </div>

    <div>{{ error && error.message }}</div>
  </div>
</template>

<script lang="ts" setup>
import { useAccount, useConnect } from 'use-wagmi'

const { connector, isReconnecting } = useAccount()
const { connect, connectors, isLoading, error, pendingConnector } = useConnect()
</script>