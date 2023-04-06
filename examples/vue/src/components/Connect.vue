<template>
  <div>
    Connect
  </div>
</template>

<script lang="ts" setup>
import { useClient } from 'use-wagmi'

const client = useClient()

console.log(client);
</script>