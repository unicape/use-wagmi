'use client'

import {
  type Config,
  type GetTransactionReceiptErrorType,
  type ResolvedRegister,
} from '@wagmi/core'
import { type Evaluate } from '@wagmi/core/internal'
import {
  type GetTransactionReceiptData,
  type GetTransactionReceiptOptions,
  type GetTransactionReceiptQueryKey,
  getTransactionReceiptQueryOptions,
} from '@wagmi/core/query'
import { type GetTransactionReceiptQueryFnData } from '@wagmi/core/query'
import { computed } from 'vue-demi'
import {
  type ConfigParameter,
  type DeepUnwrapRef,
  type MaybeRefDeep,
  type QueryParameter,
} from '../types.js'
import { cloneDeepUnref } from '../utils/cloneDeepUnref.js'
import { type UseQueryReturnType, useQuery } from '../utils/query.js'
import { useChainId } from './useChainId.js'
import { useConfig } from './useConfig.js'

export type UseTransactionReceiptParameters<
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = GetTransactionReceiptData<config, chainId>,
> = MaybeRefDeep<
  Evaluate<
    GetTransactionReceiptOptions<config, chainId> &
      ConfigParameter<config> &
      QueryParameter<
        GetTransactionReceiptQueryFnData<config, chainId>,
        GetTransactionReceiptErrorType,
        selectData,
        GetTransactionReceiptQueryKey<config, chainId>
      >
  >
>

export type UseTransactionReceiptReturnType<
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = GetTransactionReceiptData<config, chainId>,
> = UseQueryReturnType<selectData, GetTransactionReceiptErrorType>

/** https://wagmi.sh/react/api/hooks/useTransactionReceipt */
export function useTransactionReceipt<
  config extends Config = ResolvedRegister['config'],
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = GetTransactionReceiptData<config, chainId>,
>(
  parameters: UseTransactionReceiptParameters<config, chainId, selectData> = {},
): UseTransactionReceiptReturnType<config, chainId, selectData> {
  const config = useConfig(parameters)
  const chainId = useChainId()

  const queryOptions = computed(() => {
    const _parameters = cloneDeepUnref<
      DeepUnwrapRef<
        UseTransactionReceiptParameters<config, chainId, selectData>
      >
    >(parameters as any)

    const { hash, query = {} } = _parameters
    const options = getTransactionReceiptQueryOptions(config, {
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

  return useQuery(queryOptions as any) as UseTransactionReceiptReturnType<
    config,
    chainId,
    selectData
  >
}
