<script setup lang="ts">
import { useBalance, useAccount } from 'use-wagmi';
import { goerli } from 'use-wagmi/chains';

const { address } = useAccount();

const { data: default_ } = useBalance({ address });
const { data: account_ } = useBalance({ address });
const { data: goerli_ } = useBalance({
	address,
	chainId: goerli.id
});
</script>

<template>
	<div>
		<h2>Balance</h2>

		<div>Balance (Default Chain): {{ default_?.formatted }}</div>
		<div>Balance (Account Chain): {{ account_?.formatted }}</div>
		<div>Balance (Goerli Chain): {{ goerli_?.formatted }}</div>
	</div>
</template>
