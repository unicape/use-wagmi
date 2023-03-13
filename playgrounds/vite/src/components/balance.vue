<template>
  <div>
    <h3>AccountBalance</h3>

    <div>
      {{ data?.formatted }}
      <button @click="() => refetch()">Refetch</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useAccount, useBalance } from 'use-wagmi'

const { address } = useAccount()
const { data, refetch } = useBalance({ address, watch: true })
</script>