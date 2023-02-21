<template>
  <div>
    Hello Use-Wagmi

    account: {{ account }}
  </div>
</template>

<script lang="ts" setup>
import { useAccount } from 'use-wagmi/core'

const account = useAccount()
</script>