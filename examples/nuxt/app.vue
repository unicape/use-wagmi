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

    <div>
      <span>{{ ensName ?? address }}</span>
      <span v-if="ensName"> ({{ address }})</span>
    </div>

    <img v-if="ensAvatar" :src="ensAvatar" width="40" height="40">

    <div>
      <button v-if="address" @click="() => disconnect()">Disconnect</button>
      <span v-if="connector?.name">Connected to {{ connector.name }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useAccount, useDisconnect, useEnsAvatar, useEnsName, useConnect } from 'use-wagmi'

const { connector, isReconnecting } = useAccount()
const { connect, connectors, isLoading, error, pendingConnector } = useConnect()

const { address } = useAccount({
  onConnect: (data) => console.log('connected', data),
  onDisconnect: () => console.log('disconnected')
})

const { data: ensName } = useEnsName({
  address,
  chainId: 1
})

const { data: ensAvatar } = useEnsAvatar({
  name: ensName,
  chainId: 1
})

const { disconnect } = useDisconnect()
</script>
