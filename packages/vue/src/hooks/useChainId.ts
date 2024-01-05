'use client'

import {
  type Config,
  type GetChainIdReturnType,
  type ResolvedRegister,
  getChainId,
  watchChainId,
} from '@wagmi/core'
import { type ComputedRef, computed, ref } from 'vue-demi'

import type { ConfigParameter, MaybeRefDeep } from '../types.js'
import { useConfig } from './useConfig.js'

export type UseChainIdParameters<TConfig extends Config = Config> =
  MaybeRefDeep<ConfigParameter<TConfig>>

export type UseChainIdReturnType<TConfig extends Config = Config> = ComputedRef<
  GetChainIdReturnType<TConfig>
>

/** https://wagmi.sh/react/api/hooks/useChainId */
export function useChainId<TConfig extends Config = ResolvedRegister['config']>(
  parameters: UseChainIdParameters<TConfig> = {},
): UseChainIdReturnType<TConfig> {
  const config = useConfig(parameters)
  const chainId = ref(getChainId(config as ResolvedRegister['config']))

  watchChainId(config, {
    onChange() {
      chainId.value = getChainId(config)
    },
  })

  return computed<GetChainIdReturnType<TConfig>>(() => chainId.value)
}
