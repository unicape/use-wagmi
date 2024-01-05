'use client'

import type {
  Config,
  GetTransactionErrorType,
  ResolvedRegister,
} from '@wagmi/core'
import { type Evaluate } from '@wagmi/core/internal'
import {
  type GetTransactionData,
  type GetTransactionOptions,
  type GetTransactionQueryFnData,
  type GetTransactionQueryKey,
  getTransactionQueryOptions,
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

export type UseTransactionParameters<
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = GetTransactionData<config, chainId>,
> = MaybeRefDeep<
  Evaluate<
    GetTransactionOptions<config, chainId> &
      ConfigParameter<config> &
      QueryParameter<
        GetTransactionQueryFnData<config, chainId>,
        GetTransactionErrorType,
        selectData,
        GetTransactionQueryKey<config, chainId>
      >
  >
>

export type UseTransactionReturnType<
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = GetTransactionData<config, chainId>,
> = UseQueryReturnType<selectData, GetTransactionErrorType>

/** https://wagmi.sh/react/api/hooks/useTransaction */
export function useTransaction<
  config extends Config = ResolvedRegister['config'],
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = GetTransactionData<config, chainId>,
>(
  parameters: UseTransactionParameters<config, chainId, selectData> = {},
): UseTransactionReturnType<config, chainId, selectData> {
  const config = useConfig(parameters)
  const chainId = useChainId()

  const queryOptions = computed(() => {
    const _parameters = cloneDeepUnref<
      DeepUnwrapRef<UseTransactionParameters<config, chainId, selectData>>
    >(parameters as any)

    const { blockHash, blockNumber, blockTag, hash, query = {} } = _parameters
    const options = getTransactionQueryOptions(config, {
      ..._parameters,
      chainId: _parameters.chainId ?? chainId.value,
    })
    const enabled = Boolean(
      !(blockHash && blockNumber && blockTag && hash) &&
        (query.enabled ?? true),
    )

    return {
      ...query,
      ...options,
      enabled,
    }
  })

  return useQuery(queryOptions as any) as UseTransactionReturnType<
    config,
    chainId,
    selectData
  >
}
