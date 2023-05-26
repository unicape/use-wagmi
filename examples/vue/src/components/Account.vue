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

    <template v-if="true">
      <h4>Balance</h4>
      <Balance />

      <h4>Block Number</h4>
      <BlockNumber />

      <h4>Send Transaction</h4>
      <SendTransaction />

      <h4>Send Transaction Prepared</h4>
      <SendTransactionPrepared />
    </template>
    
    <!-- <template v-if="false">
      <h4>Read Contract</h4>
      <ReadContract />

      <h4>Read Contracts</h4>
      <ReadContracts />

      <h4>Read Contracts Infinite</h4>
      <ReadContractsInfinite />

      <h4>Watch Pending Transactions</h4>
      <WatchPendingTransactions />

      <h4>Write Contract</h4>
      <WriteContract />
    </template> -->
  </div>
</template>

<script lang="ts" setup>
import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'use-wagmi'
import Balance from './Balance.vue'
import BlockNumber from './BlockNumber.vue'
import SendTransaction from './SendTransaction.vue'
import SendTransactionPrepared from './SendTransactionPrepared.vue'
// import ReadContract from './read-contract/index.vue'
// import ReadContracts from './ReadContracts.vue'
// import ReadContractsInfinite from './ReadContractsInfinite.vue'
// import WatchPendingTransactions from './WatchPendingTransactions.vue'
// import WriteContract from './WriteContract.vue'

const { address, connector } = useAccount({
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