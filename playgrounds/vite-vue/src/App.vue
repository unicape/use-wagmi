<script setup lang="ts">
import { useAccount, useBalance, useChainId } from 'use-wagmi';

const { address, addresses } = useAccount();

// useBalance();
const chainId = useChainId();
</script>

<template>
	<div>
		<p>chainId - {{ chainId }}</p>
		<p>address - {{ address }}</p>
		<p>addresses - {{ addresses }}</p>
	</div>
</template>
