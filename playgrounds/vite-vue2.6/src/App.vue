<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { useAccount, useDisconnect } from 'use-wagmi'

export default defineComponent({
  name: 'App',
  setup() {
    const { address, chainId, status } = useAccount()
    const { disconnect } = useDisconnect()

    return {
      address,
      chainId,
      status,
      disconnect,
    }
  },
})
</script>

<template>
  <div>
    <h2>Account</h2>
    <div>
      account: {{ address }}
      chainId: {{ chainId }}
      status: {{ status }}
    </div>

    <button v-if="status !== 'disconnected'" type="button" @click="() => disconnect()">Disconnect</button>
  </div>
</template>