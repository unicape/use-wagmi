<template>
  <div>
    <div v-if="isLoading">loading...</div>
    <div v-if="isSuccess">
      <div v-for="item in data?.pages" :key="stringify(item)">{{ stringify(item) }}</div>
      <button @click="() => fetchNextPage()">Fetch more</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { stringify } from 'viem'
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

const { data, isLoading, isSuccess, fetchNextPage } =
  useContractInfiniteReads({
    cacheKey: 'lootTokenURIs',
    ...paginatedIndexesConfig(
      (index: number) => [
        {
          ...mlootContractConfig,
          functionName: 'tokenURI',
          args: [BigInt(index)] as const,
        }
      ],
      { start: 0, perPage: 10, direction: 'increment' }
    )
  })
</script>