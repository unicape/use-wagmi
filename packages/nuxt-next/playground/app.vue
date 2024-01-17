<template>
  <div>
    Wagmi Config:
  </div>
  <ClientOnly>
    <pre>
    {{ $wagmiConfig }}
  </pre>
  </ClientOnly>
</template>

<script setup>
const { $wagmiConfig } = useNuxtApp()
</script>

<style scoped>
pre {
  background: #eee;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #ddd;
}
</style>
