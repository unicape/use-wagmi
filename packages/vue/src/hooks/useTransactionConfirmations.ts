'use client'

import {
  type Config,
  type GetTransactionConfirmationsErrorType,
  type ResolvedRegister,
} from '@wagmi/core'
import {
  type GetTransactionConfirmationsData,
  type GetTransactionConfirmationsOptions,
  type GetTransactionConfirmationsQueryFnData,
  type GetTransactionConfirmationsQueryKey,
  getTransactionConfirmationsQueryOptions,
} from '@wagmi/core/query'

import { computed } from 'vue-demi'
import {
  type ConfigParameter,
  type MaybeRefDeep,
  type QueryParameter,
} from '../types.js'
import { cloneDeepUnref } from '../utils/cloneDeepUnref.js'
import { type UseQueryReturnType, useQuery } from '../utils/query.js'
import { useChainId } from './useChainId.js'
import { useConfig } from './useConfig.js'

export type UseTransactionConfirmationsParameters<
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] | undefined = undefined,
  selectData = GetTransactionConfirmationsData,
> = MaybeRefDeep<
  GetTransactionConfirmationsOptions<config, chainId> &
    ConfigParameter<config> &
    QueryParameter<
      GetTransactionConfirmationsQueryFnData,
      GetTransactionConfirmationsErrorType,
      selectData,
      GetTransactionConfirmationsQueryKey<config, chainId>
    >
>

export type UseTransactionConfirmationsReturnType<
  selectData = GetTransactionConfirmationsData,
> = UseQueryReturnType<selectData, GetTransactionConfirmationsErrorType>

/** https://wagmi.sh/react/api/hooks/useTransactionConfirmations */
export function useTransactionConfirmations<
  config extends Config = ResolvedRegister['config'],
  chainId extends config['chains'][number]['id'] | undefined = undefined,
  selectData = GetTransactionConfirmationsData,
>(
  parameters: UseTransactionConfirmationsParameters<
    config,
    chainId,
    selectData
  > = {} as any,
): UseTransactionConfirmationsReturnType<selectData> {
  const config = useConfig(parameters)
  const chainId = useChainId()

  const queryOptions = computed(() => {
    const _parameters = cloneDeepUnref(parameters)

    const { hash, transactionReceipt, query = {} } = _parameters
    const options = getTransactionConfirmationsQueryOptions(config, {
      ..._parameters,
      chainId: _parameters.chainId ?? chainId.value,
    })
    const enabled = Boolean(
      !(hash && transactionReceipt) &&
        (hash || transactionReceipt) &&
        (query.enabled ?? true),
    )

    return { ...query, ...options, enabled }
  })

  return useQuery(
    queryOptions as any,
  ) as UseTransactionConfirmationsReturnType<selectData>
}
