import {
  type Config,
  type ResolvedRegister,
  type WatchContractEventParameters,
  watchContractEvent,
} from '@wagmi/core'
import { type UnionEvaluate, type UnionPartial } from '@wagmi/core/internal'

import type { Abi, ContractEventName } from 'viem'
import { watchEffect } from 'vue-demi'
import type {
  ConfigParameter,
  EnabledParameter,
  MaybeRefDeep,
} from '../types.js'
import { cloneDeepUnref } from '../utils/cloneDeepUnref.js'
import { useChainId } from './useChainId.js'
import { useConfig } from './useConfig.js'

export type UseWatchContractEventParameters<
  abi extends Abi | readonly unknown[] = Abi,
  eventName extends ContractEventName<abi> = ContractEventName<abi>,
  strict extends boolean | undefined = undefined,
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
> = MaybeRefDeep<
  UnionEvaluate<
    UnionPartial<
      WatchContractEventParameters<abi, eventName, strict, config, chainId>
    > &
      ConfigParameter<config> &
      EnabledParameter
  >
>

export type UseWatchContractEventReturnType = void

/** https://wagmi.sh/react/api/hooks/useWatchContractEvent */
export function useWatchContractEvent<
  const abi extends Abi | readonly unknown[],
  eventName extends ContractEventName<abi>,
  strict extends boolean | undefined = undefined,
  config extends Config = ResolvedRegister['config'],
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
>(
  parameters: UseWatchContractEventParameters<
    abi,
    eventName,
    strict,
    config,
    chainId
  > = {} as any,
): UseWatchContractEventReturnType {
  const config = useConfig(parameters)
  const chainId = useChainId()

  watchEffect((onCleanup) => {
    const _parameters = cloneDeepUnref(parameters)

    const { enabled = true, onLogs, config: _, ...rest } = _parameters
    if (!enabled) return
    if (!onLogs) return
    const unwatch = watchContractEvent(config, {
      ...(rest as any),
      chainId: _parameters.chainId ?? chainId.value,
      onLogs,
    })

    onCleanup(() => unwatch())
  })
}
