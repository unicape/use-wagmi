<script lang="ts" setup>
import { useSignMessage } from 'use-wagmi'

const { data, signMessage } = useSignMessage()

function onSubmit(event: Event) {
  event.preventDefault()
  const formData = new FormData(event.target as HTMLFormElement)
  signMessage({ message: formData.get('message') as string })
}
</script>

<template>
  <div>
    <h2>Sign Message</h2>

    <form @submit="onSubmit">
      <input name="message" />
      <button type="submit">Sign Message</button>
    </form>

    {{ data }}
  </div>
</template>