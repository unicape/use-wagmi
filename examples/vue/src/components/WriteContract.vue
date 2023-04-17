<template>
  <div>
    <div>Mint an Adjective Noun Verb:</div>
    <div>
      <input type="text" v-model="tokenId">
      <button>Mint</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { BigNumber } from 'ethers'
import { useContractWrite } from 'use-wagmi'

import { anvAbi } from './anv-abi'

const tokenId = ref<number>()

const {} = useContractWrite({
  mode: 'recklesslyUnprepared',
  address: '0xe614fbd03d58a60fd9418d4ab5eb5ec6c001415f',
  abi: anvAbi,
  functionName: 'claim',
  chainId: 1,
})
</script>