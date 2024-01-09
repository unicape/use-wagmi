<script setup>
const { address, chainId, status } = useAccount()
const { disconnect } = useDisconnect()
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