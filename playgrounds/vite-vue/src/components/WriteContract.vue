<script setup lang="ts">
import { parseAbi } from 'viem'
import { BaseError, useWriteContract, useWaitForTransactionReceipt } from 'use-wagmi'

const { data: hash, error, isPending, writeContract } = useWriteContract()

async function submit(e: Event) {
  e.preventDefault()
  const formData = new FormData(e.target as HTMLFormElement)
  const tokenId = formData.get('tokenId') as string
  writeContract({
    address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
    abi: parseAbi(['function mint(uint256 tokenId)']),
    functionName: 'mint',
    args: [BigInt(tokenId)],
  })
}

const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
  hash,
})
</script>

<template>
  <div>
    <h2>Write Contract</h2>
    <form @submit="submit">
      <input name="tokenId" placeholder="Token ID" required />
      <button :disabled="isPending" type="submit">
        {{ isPending ? 'Confirming...' : 'Mint' }}
      </button>
    </form>
    <div v-if="hash">Transaction Hash: {hash}</div>
    <div v-if="isConfirming">Waiting for confirmation...</div>
    <div v-if="isConfirmed">Transaction confirmed.</div>
    <div v-if="error">Error: {{ (error as BaseError).shortMessage || error.message }}</div>
  </div>
</template>