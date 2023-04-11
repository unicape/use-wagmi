<template>
  <div>
    <div>
      <span>{{ ensName ?? address }}</span>
      <span v-if="ensName"> ({{ address }})</span>
    </div>

    <img v-if="ensAvatar" :src="ensAvatar" width="40" height="40">

    <div>
      <button v-if="address" @click="() => disconnect()">Disconnect</button>
      <span v-if="connector?.name">Connected to {{ connector.name }}</span>
    </div>

    <h4>Balance</h4>
    <Balance />
  </div>
</template>

<script lang="ts" setup>
import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'use-wagmi'
import Balance from './Balance.vue';

const { address, connector } = useAccount({
  onConnect: (data) => console.log('connected', data),
  onDisconnect: () => console.log('disconnected')
})
const { data: ensAvatar } = useEnsAvatar({
  address,
  chainId: 1
})
const { data: ensName } = useEnsName({
  address,
  chainId: 1
})

const { disconnect } = useDisconnect()
</script>