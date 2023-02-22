<script lang="ts" setup>
import { useNetwork } from 'use-wagmi/core'

const { chain, chains } = useNetwork()

console.log(chain, chains);
</script>