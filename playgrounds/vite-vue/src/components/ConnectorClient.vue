<script lang="ts" setup>
import { useConnectorClient } from 'use-wagmi'

const { data, error } = useConnectorClient()
</script>

<template>
  <div>
    <h2>Connector Client</h2>
    client {{ data?.account?.address }} {{ data?.chain?.id }}
    {{ error?.message }}
  </div>
</template>