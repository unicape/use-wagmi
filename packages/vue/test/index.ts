import { waitFor } from '@testing-library/dom'
import { render } from '@testing-library/vue'
import { QueryClient } from 'vue-query'

import WagmiConfig from './components/WagmiConfig.vue'
import { setupClient } from './utils'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Prevent Jest from garbage collecting cache
      cacheTime: Infinity,
      // Turn off retries to prevent timeouts
      retry: false,
    },
  },
  logger: {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    error: () => {},
    log: console.log,
    warn: console.warn,
  },
})

export async function renderHook(hook: any) {
  render(WagmiConfig, {
    props: {
      client: setupClient({ queryClient }),
    },
  })

  queryClient.clear()

  await waitFor(() => hook())
}
