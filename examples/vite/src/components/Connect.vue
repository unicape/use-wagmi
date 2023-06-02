<template>
  <div>
    <div>
      <button
        v-for="x in connectors"
        :key="x.name"
        :disabled="!x.ready || isReconnecting || connector?.id === x.id"
        @click="() => connect({ connector: x })"
      >
        <span>{{ x.name }}</span>
        <span v-if="!x.ready"> (unsupported)</span>
        <span v-if="isLoading && x.id === pendingConnector?.id">…</span>
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