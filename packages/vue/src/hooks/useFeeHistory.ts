'use client'

import {
  type Config,
  type GetFeeHistoryErrorType,
  type ResolvedRegister,
} from '@wagmi/core'
import { type Evaluate } from '@wagmi/core/internal'
import {
  type GetFeeHistoryData,
  type GetFeeHistoryOptions,
  type GetFeeHistoryQueryFnData,
  type GetFeeHistoryQueryKey,
  getFeeHistoryQueryOptions,
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

export type UseFeeHistoryParameters<
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = GetFeeHistoryData,
> = MaybeRefDeep<
  Evaluate<
    GetFeeHistoryOptions<config, chainId> &
      ConfigParameter<config> &
      QueryParameter<
        GetFeeHistoryQueryFnData,
        GetFeeHistoryErrorType,
        selectData,
        GetFeeHistoryQueryKey<config, chainId>
      >
  >
>

export type UseFeeHistoryReturnType<selectData = GetFeeHistoryData> =
  UseQueryReturnType<selectData, GetFeeHistoryErrorType>

/** https://wagmi.sh/react/api/hooks/useFeeHistory */
export function useFeeHistory<
  config extends Config = ResolvedRegister['config'],
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = GetFeeHistoryData,
>(
  parameters: UseFeeHistoryParameters<config, chainId, selectData> = {},
): UseFeeHistoryReturnType<selectData> {
  const config = useConfig(parameters)
  const chainId = useChainId()

  const queryOptions = computed(() => {
    const _parameters = cloneDeepUnref<
      DeepUnwrapRef<UseFeeHistoryParameters<config, chainId, selectData>>
    >(parameters as any)

    const { blockCount, rewardPercentiles, query = {} } = _parameters
    const options = getFeeHistoryQueryOptions(config, {
      ..._parameters,
      chainId: _parameters.chainId ?? chainId.value,
    })
    const enabled = Boolean(
      blockCount && rewardPercentiles && (query.enabled ?? true),
    )

    return {
      ...query,
      ...options,
      enabled,
    }
  })

  return useQuery(queryOptions as any) as UseFeeHistoryReturnType<selectData>
}
