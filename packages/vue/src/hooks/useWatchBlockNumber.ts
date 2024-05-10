import {
  type Config,
  type ResolvedRegister,
  type WatchBlockNumberParameters,
  watchBlockNumber,
} from '@wagmi/core'
import { type UnionEvaluate, type UnionPartial } from '@wagmi/core/internal'
import { watchEffect } from 'vue-demi'

import type {
  ConfigParameter,
  EnabledParameter,
  MaybeRefDeep,
} from '../types.js'
import { cloneDeepUnref } from '../utils/cloneDeepUnref.js'
import { useChainId } from './useChainId.js'
import { useConfig } from './useConfig.js'

export type UseWatchBlockNumberParameters<
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
> = MaybeRefDeep<
  UnionEvaluate<
    UnionPartial<WatchBlockNumberParameters<config, chainId>> &
      ConfigParameter<config> &
      EnabledParameter
  >
>

export type UseWatchBlockNumberReturnType = void

/** https://wagmi.sh/react/api/hooks/useWatchBlockNumber */
export function useWatchBlockNumber<
  config extends Config = ResolvedRegister['config'],
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
>(
  parameters: UseWatchBlockNumberParameters<config, chainId> = {} as any,
): UseWatchBlockNumberReturnType {
  const config = useConfig(parameters)
  const configChainId = useChainId()

  watchEffect((onCleanup) => {
    const {
      enabled = true,
      onBlockNumber,
      config: _,
      chainId: _chainId,
      ...rest
    } = cloneDeepUnref(parameters)

    const chainId = _chainId ?? configChainId.value
    if (!enabled) return
    if (!onBlockNumber) return
    const unwatch = watchBlockNumber(config, {
      ...(rest as any),
      chainId,
      onBlockNumber,
    })

    onCleanup(unwatch)
  })
}
