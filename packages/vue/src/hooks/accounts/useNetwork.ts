import { getNetwork, watchNetwork } from '@wagmi/core'
import { getCurrentScope, onScopeDispose, reactive, toRefs } from 'vue-demi'

export function useNetwork() {
  let network = reactive(getNetwork())

  const unwatch = watchNetwork((data) => {
    network = Object.assign(network, data)
  })

  if (getCurrentScope()) onScopeDispose(() => unwatch())

  return toRefs(network)
}
