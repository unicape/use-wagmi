'use client'

import {
  type GetConnectorsReturnType,
  getConnectors,
  watchConnectors,
} from '@wagmi/core'

import { type ShallowRef, shallowRef } from 'vue-demi'
import type { ConfigParameter, MaybeRefDeep } from '../types.js'
import { useConfig } from './useConfig.js'

export type UseConnectorsParameters = MaybeRefDeep<ConfigParameter>

export type UseConnectorsReturnType = ShallowRef<GetConnectorsReturnType>

/** https://wagmi.sh/react/api/hooks/useConnections */
export function useConnectors(
  parameters: UseConnectorsParameters = {},
): UseConnectorsReturnType {
  const config = useConfig(parameters)

  const connectors = shallowRef(getConnectors(config))

  watchConnectors(config, {
    onChange() {
      connectors.value = getConnectors(config)
    },
  })

  return connectors
}
