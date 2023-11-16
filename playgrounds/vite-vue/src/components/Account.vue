<script setup lang="ts">
import { useAccount } from 'use-wagmi';

const account = useAccount();
</script>

<template>
	<div>
		<h2>Account</h2>

		<div>
			account: {{ account.address }}
			<br />
			chainId: {{ account.chainId }}
			<br />
			status: {{ account.status }}
		</div>

		<button v-if="account.isConnected" type="button">Disconnect</button>
	</div>
</template>
