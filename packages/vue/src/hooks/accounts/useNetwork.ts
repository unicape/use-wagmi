import { getNetwork, watchNetwork } from '@wagmi/core'
import type { Chain } from '@wagmi/core'
import { getCurrentScope, onScopeDispose, reactive, toRefs } from 'vue-demi'

type GetNetworkResult = {
  chain?: Chain & {
    unsupported?: boolean
  }
  chains: Chain[]
}

export function useNetwork() {
  let network = reactive(getNetwork())

  const unwatch = watchNetwork((data) => {
    network = Object.assign(network, data)
  })

  if (getCurrentScope()) onScopeDispose(() => unwatch())

  return toRefs<GetNetworkResult>(network)
}
