<template>
  <div>
    <form @submit="onSubmit">
      <input name="message" type="text" required>
      <button :disabled="isLoading">
      {{ isLoading ? 'Check Wallet' : 'Sign Message' }}</button>
    </form>

    <div v-if="signature">
      <div>signature {{ signature }}</div>
      <div>recovered address {{ recoveredAddress }}</div>
    </div>

    <div v-if="error">{{ error.message ?? 'Failed to sign message' }}</div>
  </div>
</template>

<script lang="ts" setup>
import { computedAsync } from '@vueuse/core'
import { recoverMessageAddress } from 'viem'
import { useSignMessage } from 'use-wagmi'
import type { Address } from 'use-wagmi'

const { data: signature, variables, error, isLoading, signMessage } = useSignMessage()
const recoveredAddress = computedAsync<Address | undefined>(async () => {
  if (variables.value?.message && signature.value) {
    const address = await recoverMessageAddress({
      message: variables.value.message,
      signature: signature.value
    })
    return address
  }
}, undefined)

function onSubmit (event: Event) {
  event.preventDefault()
  const element = event.target as HTMLFormElement
  const formData = new FormData(element)
  const message = formData.get('message') as string
  signMessage({ message })
}
</script>