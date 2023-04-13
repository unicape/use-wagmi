<template>
  <div>{{ data }}</div>
</template>

<script lang="ts" setup>
import { useBlockNumber } from 'use-wagmi'

const { data } = useBlockNumber({ watch: true })
</script>