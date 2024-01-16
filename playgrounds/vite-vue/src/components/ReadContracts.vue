<script setup lang="ts">
import { computed } from 'vue'
import { useReadContracts } from 'use-wagmi'
import { wagmiContractConfig } from '../contracts'

const { data } = useReadContracts({
  allowFailure: false,
  contracts: [
    {
      ...wagmiContractConfig,
      functionName: 'balanceOf',
      args: ['0x03A71968491d55603FFe1b11A9e23eF013f75bCF'],
    },
    {
      ...wagmiContractConfig,
      functionName: 'ownerOf',
      args: [69n],
    },
    {
      ...wagmiContractConfig,
      functionName: 'totalSupply',
    },
  ],
})

const balance = computed(() => (data.value || [])[0])
const ownerOf = computed(() => (data.value || [])[1])
const totalSupply = computed(() => (data.value || [])[2])
</script>

<template>
  <div>
    <h2>Read Contract</h2>
    <div>Balance: {{ balance?.toString() }}</div>
    <div>Owner of Token 69: {{ ownerOf?.toString() }}</div>
    <div>Total Supply: {{ totalSupply?.toString() }}</div>
  </div>
</template>