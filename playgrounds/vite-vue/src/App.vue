<script setup lang="ts">
import { useAccount, useBalance, useChainId } from 'use-wagmi';

const { address, addresses } = useAccount();

// useBalance();
const chainId = useChainId();
const { data } = useBalance({
	address
});
</script>

<template>
	<div>
		<p>chainId - {{ chainId }}</p>
		<p>address - {{ address }}</p>
		<p>addresses - {{ addresses }}</p>
		<p>{{ data?.value }}</p>
	</div>
</template>
