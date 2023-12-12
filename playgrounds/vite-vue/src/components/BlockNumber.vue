<script lang="ts" setup>
import { useBlockNumber } from 'use-wagmi'
import { optimism } from 'use-wagmi/chains'

const { data: default_ } = useBlockNumber({ watch: true })
const { data: account_ } = useBlockNumber({
  watch: true,
})
const { data: optimism_ } = useBlockNumber({
  chainId: optimism.id,
  watch: true,
})
</script>

<template>
  <div>
    <h2>Block Number</h2>

    <div>Block Number (Default Chain): {{ default_?.toString() }}</div>
    <div>Block Number (Account Chain): {{ account_?.toString() }}</div>
    <div>Block Number (Optimism): {{ optimism_?.toString() }}</div>
  </div>
</template>