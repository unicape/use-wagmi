<template>
  <div>
    <button @click="() => disconnect()">Disconnect</button>
  </div>
</template>

<script lang="ts" setup>
import { useDisconnect } from 'use-wagmi/core'

const { disconnect } = useDisconnect()
</script>