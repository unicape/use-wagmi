import {
  type GetConnectionsReturnType,
  getConnections,
  watchConnections,
} from '@wagmi/core'

import { type ShallowRef, shallowRef } from 'vue-demi'
import type { ConfigParameter, MaybeRefDeep } from '../types.js'
import { useConfig } from './useConfig.js'

export type UseConnectionsParameters = MaybeRefDeep<ConfigParameter>

export type UseConnectionsReturnType = ShallowRef<GetConnectionsReturnType>

/** https://wagmi.sh/react/api/hooks/useConnections */
export function useConnections(
  parameters: UseConnectionsParameters = {},
): UseConnectionsReturnType {
  const config = useConfig(parameters)

  const connections = shallowRef(getConnections(config))

  watchConnections(config, {
    onChange() {
      connections.value = getConnections(config)
    },
  })

  return connections
}
