<script setup lang="ts">
import Account from './components/Account.vue'
import Connect from './components/Connect.vue'
import SwitchAccount from './components/SwitchAccount.vue'
import SwitchChain from './components/SwitchChain.vue'
import SignMessage from './components/SignMessage.vue'
import Connections from './components/Connections.vue'
import BlockNumber from './components/BlockNumber.vue'
import Balance from './components/Balance.vue'
import ConnectorClient from './components/ConnectorClient.vue'
import SendTransaction from './components/SendTransaction.vue'
import ReadContract from './components/ReadContract.vue'
import ReadContracts from './components/ReadContracts.vue'
import WriteContract from './components/WriteContract.vue'
</script>

<template>
	<Account />
	<Connect />
	<SwitchAccount />
	<SwitchChain />
	<SignMessage />
	<Connections />
	<BlockNumber />
	<Balance />
	<ConnectorClient />
	<SendTransaction />
	<ReadContract />
	<ReadContracts />
	<WriteContract />
</template>
