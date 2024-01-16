import { mainnet, sepolia } from "viem/chains"
import { http } from "viem"


export default defineNuxtConfig({
  modules: ['../src/module'],
  useWagmi: {
    config: {
      chains: [mainnet, sepolia],
      transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
      } as any,
    }
  },
  devtools: { enabled: true }
})
