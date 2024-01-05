'use client'

import {
  type Config,
  type EstimateFeesPerGasErrorType,
  type ResolvedRegister,
} from '@wagmi/core'
import { type Evaluate } from '@wagmi/core/internal'
import {
  type EstimateFeesPerGasData,
  type EstimateFeesPerGasOptions,
  type EstimateFeesPerGasQueryFnData,
  type EstimateFeesPerGasQueryKey,
  estimateFeesPerGasQueryOptions,
} from '@wagmi/core/query'
import type { FeeValuesType } from 'viem'

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

export type UseEstimateFeesPerGasParameters<
  type extends FeeValuesType = FeeValuesType,
  config extends Config = Config,
  selectData = EstimateFeesPerGasData<type>,
> = MaybeRefDeep<
  Evaluate<
    EstimateFeesPerGasOptions<type, config> &
      ConfigParameter<config> &
      QueryParameter<
        EstimateFeesPerGasQueryFnData<type>,
        EstimateFeesPerGasErrorType,
        selectData,
        EstimateFeesPerGasQueryKey<config, type>
      >
  >
>

export type UseEstimateFeesPerGasReturnType<
  type extends FeeValuesType = FeeValuesType,
  selectData = EstimateFeesPerGasData<type>,
> = UseQueryReturnType<selectData, EstimateFeesPerGasErrorType>

/** https://wagmi.sh/react/api/hooks/useEstimateFeesPerGas */
export function useEstimateFeesPerGas<
  config extends Config = ResolvedRegister['config'],
  type extends FeeValuesType = 'eip1559',
  selectData = EstimateFeesPerGasData<type>,
>(
  parameters: UseEstimateFeesPerGasParameters<type, config, selectData> = {},
): UseEstimateFeesPerGasReturnType<type, selectData> {
  const config = useConfig(parameters)
  const chainId = useChainId()

  const queryOptions = computed(() => {
    const _parameters = cloneDeepUnref<
      DeepUnwrapRef<UseEstimateFeesPerGasParameters<type, config, selectData>>
    >(parameters as any)

    const { query = {} } = _parameters
    const options = estimateFeesPerGasQueryOptions(config, {
      ..._parameters,
      chainId: _parameters.chainId ?? chainId.value,
    })

    return {
      ...query,
      ...options,
    }
  })

  return useQuery(queryOptions as any) as UseEstimateFeesPerGasReturnType<
    type,
    selectData
  >
}
