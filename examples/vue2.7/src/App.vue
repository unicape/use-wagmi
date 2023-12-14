<template>
  <div id="app">
    {{ address }}

    <button @click="connect">Connect</button>
    <button @click="disconnect">Disconnect</button>
  </div>
</template>

<script setup>
import { useAccount, useConnect, useDisconnect } from 'use-wagmi'
import { InjectedConnector } from 'use-wagmi/connectors/injected'

const { address } = useAccount()
const { connect } = useConnect({ connector: new InjectedConnector() })
const { disconnect } = useDisconnect()
</script>
