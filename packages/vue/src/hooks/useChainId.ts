'use client'

import { ref, computed, type ComputedRef } from 'vue'
import {
  type Config,
  type GetChainIdReturnType,
  type ResolvedRegister,
  getChainId,
  watchChainId,
} from '@wagmi/core'

import type { ConfigParameter } from '../types/properties.js'
import type { DeepMaybeRef } from '../types/index.js'
import { useConfig } from './useConfig.js'

export type UseChainIdParameters<config extends Config = Config> = DeepMaybeRef<
  ConfigParameter<config>
>

export type UseChainIdReturnType<config extends Config = Config> = ComputedRef<
  GetChainIdReturnType<config>
>

/** https://beta.wagmi.sh/react/api/hooks/useChainId */
export function useChainId<config extends Config = ResolvedRegister['config']>(
  parameters: UseChainIdParameters<config> = {},
): UseChainIdReturnType<config> {
  const config = useConfig(parameters)
  const chainId = ref(getChainId(config as ResolvedRegister['config']))

  watchChainId(config, {
    onChange() {
      chainId.value = getChainId(config)
    },
  })

  return computed(() => chainId.value)
}
