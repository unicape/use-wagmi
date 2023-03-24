<template>
  <div>
    <div v-if="isLoading">loading...</div>
    <div v-if="isSuccess">
      <div v-for="item in data?.pages">
        {{ JSON.stringify(item) }}
      </div>
      <button @click="() => fetchNextPage()">Fetch more</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { BigNumber } from 'ethers'
import { paginatedIndexesConfig, useContractInfiniteReads } from 'use-wagmi'

const mlootContractConfig = {
  address: '0x1dfe7ca09e99d10835bf73044a23b73fc20623df',
  abi: [
    {
      inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
      name: 'tokenURI',
      outputs: [{ internalType: 'string', name: '', type: 'string' }],
      stateMutability: 'view',
      type: 'function',
    },
  ],
} as const

const { data, isLoading, isSuccess, fetchNextPage } = useContractInfiniteReads({
  cacheKey: 'lootTokenURIs',
  ...paginatedIndexesConfig(index => ([
    {
      ...mlootContractConfig,
      functionName: 'tokenURI',
      args: [BigNumber.from(index)] as const
    }
  ]), { start: 0, perPage: 10, direction: 'increment' })
})
</script>