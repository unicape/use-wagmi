<script lang="ts" setup>
import { useChainId, useConnect } from 'use-wagmi'

const chainId = useChainId()
const { connectors, connect, status, error } = useConnect()
</script>

<template>
	<div>
		<h2>Connect</h2>
		<button v-for="connector in connectors" :key="connector.uid" @click="() => connect({ connector, chainId })"
			type="button">
			{{ connector.name }}
		</button>
		<div>{{ status }}</div>
		<div>{{ error?.message }}</div>
	</div>
</template>
