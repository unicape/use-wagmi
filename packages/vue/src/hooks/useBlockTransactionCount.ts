'use client'

import {
  type Config,
  type GetBlockTransactionCountErrorType,
  type ResolvedRegister,
} from '@wagmi/core'
import { type UnionEvaluate } from '@wagmi/core/internal'
import {
  type GetBlockTransactionCountData,
  type GetBlockTransactionCountOptions,
  type GetBlockTransactionCountQueryFnData,
  type GetBlockTransactionCountQueryKey,
  getBlockTransactionCountQueryOptions,
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

export type UseBlockTransactionCountParameters<
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = GetBlockTransactionCountData,
> = MaybeRefDeep<
  UnionEvaluate<
    GetBlockTransactionCountOptions<config, chainId> &
      ConfigParameter<config> &
      QueryParameter<
        GetBlockTransactionCountQueryFnData,
        GetBlockTransactionCountErrorType,
        selectData,
        GetBlockTransactionCountQueryKey<config, chainId>
      >
  >
>

export type UseBlockTransactionCountReturnType<
  selectData = GetBlockTransactionCountData,
> = UseQueryReturnType<selectData, GetBlockTransactionCountErrorType>

/** https://rc.wagmi.sh/react/api/hooks/useBlockTransactionCount */
export function useBlockTransactionCount<
  config extends Config = ResolvedRegister['config'],
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = GetBlockTransactionCountData,
>(
  parameters: UseBlockTransactionCountParameters<
    config,
    chainId,
    selectData
  > = {},
): UseBlockTransactionCountReturnType<selectData> {
  const config = useConfig(parameters)
  const chainId = useChainId()

  const queryOptions = computed(() => {
    const _parameters = cloneDeepUnref<
      DeepUnwrapRef<
        UseBlockTransactionCountParameters<config, chainId, selectData>
      >
    >(parameters as any)

    const { query = {} } = _parameters
    const options = getBlockTransactionCountQueryOptions(config, {
      ..._parameters,
      chainId: _parameters.chainId ?? chainId.value,
    })

    return {
      ...query,
      ...options,
    }
  })

  return useQuery(
    queryOptions as any,
  ) as UseBlockTransactionCountReturnType<selectData>
}
