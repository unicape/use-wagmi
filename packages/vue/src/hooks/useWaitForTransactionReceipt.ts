import type {
  Config,
  ResolvedRegister,
  WaitForTransactionReceiptErrorType,
} from '@wagmi/core'
import { type Evaluate } from '@wagmi/core/internal'
import {
  type WaitForTransactionReceiptData,
  type WaitForTransactionReceiptOptions,
  type WaitForTransactionReceiptQueryFnData,
  type WaitForTransactionReceiptQueryKey,
  waitForTransactionReceiptQueryOptions,
} from '@wagmi/core/query'

import { computed } from 'vue-demi'
import type {
  ConfigParameter,
  DeepUnwrapRef,
  MaybeRefDeep,
  QueryParameter,
} from '../types.js'
import { cloneDeepUnref } from '../utils/cloneDeepUnref.js'
import { type UseQueryReturnType, useQuery } from '../utils/query.js'
import { useChainId } from './useChainId.js'
import { useConfig } from './useConfig.js'

export type UseWaitForTransactionReceiptParameters<
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = WaitForTransactionReceiptData<config, chainId>,
> = MaybeRefDeep<
  Evaluate<
    WaitForTransactionReceiptOptions<config, chainId> &
      ConfigParameter<config> &
      QueryParameter<
        WaitForTransactionReceiptQueryFnData<config, chainId>,
        WaitForTransactionReceiptErrorType,
        selectData,
        WaitForTransactionReceiptQueryKey<config, chainId>
      >
  >
>

export type UseWaitForTransactionReceiptReturnType<
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = WaitForTransactionReceiptData<config, chainId>,
> = UseQueryReturnType<selectData, WaitForTransactionReceiptErrorType>

/** https://wagmi.sh/react/api/hooks/useWaitForTransactionReceipt */
export function useWaitForTransactionReceipt<
  config extends Config = ResolvedRegister['config'],
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = WaitForTransactionReceiptData<config, chainId>,
>(
  parameters: UseWaitForTransactionReceiptParameters<
    config,
    chainId,
    selectData
  > = {},
): UseWaitForTransactionReceiptReturnType<config, chainId, selectData> {
  const config = useConfig(parameters)
  const chainId = useChainId()

  const queryOptions = computed(() => {
    const _parameters = cloneDeepUnref<
      DeepUnwrapRef<
        UseWaitForTransactionReceiptParameters<config, chainId, selectData>
      >
    >(parameters as any)

    const { hash, query = {} } = _parameters
    const options = waitForTransactionReceiptQueryOptions(config, {
      ..._parameters,
      chainId: _parameters.chainId ?? chainId.value,
    })
    const enabled = Boolean(hash && (query.enabled ?? true))

    return {
      ...query,
      ...options,
      enabled,
    }
  })

  return useQuery(
    queryOptions as any,
  ) as UseWaitForTransactionReceiptReturnType<config, chainId, selectData>
}
