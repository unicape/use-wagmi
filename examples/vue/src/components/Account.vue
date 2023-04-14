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

    <template v-if="false">
      <h4>Balance</h4>
      <Balance />

      <h4>Block Number</h4>
      <BlockNumber />

      <h4>Send Transaction</h4>
      <SendTransaction />

      <h4>Send Transaction Prepared</h4>
      <SendTransactionPrepared />
    </template>
    
    <h4>Read Contract</h4>
    <ReadContract />
  </div>
</template>

<script lang="ts" setup>
import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'use-wagmi'
import Balance from './Balance.vue'
import BlockNumber from './BlockNumber.vue'
import SendTransaction from './SendTransaction.vue'
import SendTransactionPrepared from './SendTransactionPrepared.vue'
import ReadContract from './read-contract/index.vue'

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