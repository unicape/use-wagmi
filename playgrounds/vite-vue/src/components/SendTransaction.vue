<script setup lang="ts">
import { BaseError, useSendTransaction, useWaitForTransactionReceipt } from 'use-wagmi'
import { Hex, parseEther } from 'viem'

const { data: hash, error, isPending, sendTransaction } = useSendTransaction()

async function submit(e: Event) {
  e.preventDefault()
  const formData = new FormData(e.target as HTMLFormElement)
  const to = formData.get('address') as Hex
  const value = formData.get('value') as string
  sendTransaction({ to, value: parseEther(value) })
}

const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
  hash,
})
</script>

<template>
  <div>
    <h2>Send Transaction</h2>
    {{ a }}
    <form @submit="submit">
      <input name="address" placeholder="Address" required />
      <input name="value" placeholder="Amount (ETH)" type="number" step="0.000000001" required />
      <button :disabled="isPending" type="submit">
        {{ isPending ? 'Confirming...' : 'Send' }}
      </button>
    </form>
    <div v-if="hash">Transaction Hash: {hash}</div>
    <div v-if="isConfirming">Waiting for confirmation...</div>
    <div v-if="isConfirmed">Transaction confirmed.</div>
    <div v-if="error">Error: {{ (error as BaseError).shortMessage || error.message }}</div>
  </div>
</template>