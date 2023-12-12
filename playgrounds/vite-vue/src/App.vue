<script setup lang="ts">
import Account from './components/Account.vue'
import Connect from './components/Connect.vue'
import SwitchAccount from './components/SwitchAccount.vue'
import SwitchChain from './components/SwitchChain.vue'
import SignMessage from './components/SignMessage.vue'
import Connections from './components/Connections.vue'
import BlockNumber from './components/BlockNumber.vue'
import Balance from './components/Balance.vue'
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
</template>
