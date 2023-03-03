import { reactive, toRefs, getCurrentScope, onScopeDispose } from 'vue-demi'
import { getNetwork, watchNetwork } from '@wagmi/core'

export function useNetwork () {
  let network = reactive(getNetwork())

  const unwatch = watchNetwork(data => {
    network = Object.assign(network, data)
  })

  if (getCurrentScope())
    onScopeDispose(() => unwatch())

  return toRefs(network)
}