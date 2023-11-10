<script setup lang="ts">
import { useAccount } from 'use-wagmi';

const { address, addresses, chainId } = useAccount();
</script>

<template>
	<div>
		<p>chainId - {{ chainId }}</p>
		<p>address - {{ address }}</p>
		<p>addresses - {{ addresses }}</p>
	</div>
</template>
