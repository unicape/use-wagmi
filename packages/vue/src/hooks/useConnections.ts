'use client'

import {
  type GetConnectionsReturnType,
  getConnections,
  watchConnections,
} from '@wagmi/core'

import type { ConfigParameter, MaybeRefDeep } from '../types.js'
import { useConfig } from './useConfig.js'
import { shallowRef, type ShallowRef } from 'vue'

export type UseConnectionsParameters = MaybeRefDeep<ConfigParameter>

export type UseConnectionsReturnType = ShallowRef<GetConnectionsReturnType>

/** https://beta.wagmi.sh/react/api/hooks/useConnections */
export function useConnections(
  parameters: UseConnectionsParameters = {},
): UseConnectionsReturnType {
  const config = useConfig(parameters)

  const connectors = shallowRef(getConnections(config))

  watchConnections(config, {
    onChange() {
      connectors.value = getConnections(config)
    },
  })

  return connectors
}
