import { getNetwork, watchNetwork } from '@wagmi/core'
import type { Chain } from '@wagmi/core'
import { getCurrentScope, onScopeDispose, reactive, toRefs } from 'vue-demi'

import { updateState } from '../../utils'

type GetNetworkResult = {
  chain?: Chain & {
    unsupported?: boolean
  }
  chains: Chain[]
}

export function useNetwork() {
  const network = reactive<GetNetworkResult>(getNetwork())

  const unwatch = watchNetwork((data) => {
    updateState(network, data)
  })

  if (getCurrentScope()) onScopeDispose(() => unwatch())

  return toRefs(network)
}
