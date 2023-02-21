<template>
  <div>
    <button @click="() => connect()">Connect Wallet</button>
  </div>
</template>

<script lang="ts" setup>
import { useConnect } from 'use-wagmi/core'
import { InjectedConnector } from 'use-wagmi/connectors'

const { connect } = useConnect({
  connector: new InjectedConnector()
})
</script>