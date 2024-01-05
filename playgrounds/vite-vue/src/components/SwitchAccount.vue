<script lang="ts" setup>
import { useAccount, useSwitchAccount } from 'use-wagmi'

const { connector } = useAccount()
const { connectors, switchAccount } = useSwitchAccount()
</script>

<template>
  <div>
    <h2>Switch Account</h2>

    <button v-for="ctor in connectors" :disabled="connector?.uid === ctor.uid" :key="ctor.uid"
      @click="() => switchAccount({ connector: ctor })" type="button">
      {{ ctor.name }}
    </button>
  </div>
</template>