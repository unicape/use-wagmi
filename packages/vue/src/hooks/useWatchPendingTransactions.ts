import {
  type Config,
  type ResolvedRegister,
  type WatchPendingTransactionsParameters,
  watchPendingTransactions,
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

export type UseWatchPendingTransactionsParameters<
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
> = MaybeRefDeep<
  UnionEvaluate<
    UnionPartial<WatchPendingTransactionsParameters<config, chainId>> &
      ConfigParameter<config> &
      EnabledParameter
  >
>

export type UseWatchPendingTransactionsReturnType = void

/** https://wagmi.sh/react/api/hooks/useWatchPendingTransactions */
export function useWatchPendingTransactions<
  config extends Config = ResolvedRegister['config'],
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
>(
  parameters: UseWatchPendingTransactionsParameters<
    config,
    chainId
  > = {} as any,
): UseWatchPendingTransactionsReturnType {
  const config = useConfig(parameters)
  const chainId = useChainId()

  watchEffect((onCleanup) => {
    const _parameters = cloneDeepUnref(parameters)
    const { enabled = true, onTransactions, config: _, ...rest } = _parameters

    if (!enabled) return
    if (!onTransactions) return
    const unwatch = watchPendingTransactions(config, {
      ...(rest as any),
      chainId,
      onTransactions,
    })

    onCleanup(() => unwatch())
  })
}
