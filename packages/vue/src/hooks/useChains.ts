import {
  type Config,
  type GetChainsReturnType,
  type ResolvedRegister,
  getChains,
} from '@wagmi/core'
import { watchChains } from '@wagmi/core/internal'
import { type Ref, ref } from 'vue-demi'

import type { ConfigParameter, MaybeRefDeep } from '../types.js'
import { useConfig } from './useConfig.js'

export type UseChainsParameters<config extends Config = Config> = MaybeRefDeep<
  ConfigParameter<config>
>

export type UseChainsReturnType<config extends Config = Config> = Ref<
  GetChainsReturnType<config>
>
/** https://wagmi.sh/react/api/hooks/useChains */
export function useChains<config extends Config = ResolvedRegister['config']>(
  parameters: UseChainsParameters<config> = {},
): UseChainsReturnType<config> {
  const config = useConfig(parameters)
  const chains = ref(getChains(config))

  watchChains(config, {
    onChange() {
      chains.value = getChains(config)
    },
  })

  return chains
}
