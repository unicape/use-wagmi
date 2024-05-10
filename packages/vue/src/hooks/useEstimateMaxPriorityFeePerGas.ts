import {
  type Config,
  type EstimateMaxPriorityFeePerGasErrorType,
  type ResolvedRegister,
} from '@wagmi/core'
import { type Evaluate } from '@wagmi/core/internal'
import {
  type EstimateMaxPriorityFeePerGasData,
  type EstimateMaxPriorityFeePerGasOptions,
  type EstimateMaxPriorityFeePerGasQueryFnData,
  type EstimateMaxPriorityFeePerGasQueryKey,
  estimateMaxPriorityFeePerGasQueryOptions,
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

export type UseEstimateMaxPriorityFeePerGasParameters<
  config extends Config = Config,
  selectData = EstimateMaxPriorityFeePerGasData,
> = MaybeRefDeep<
  Evaluate<
    EstimateMaxPriorityFeePerGasOptions<config> &
      ConfigParameter<config> &
      QueryParameter<
        EstimateMaxPriorityFeePerGasQueryFnData,
        EstimateMaxPriorityFeePerGasErrorType,
        selectData,
        EstimateMaxPriorityFeePerGasQueryKey<config>
      >
  >
>

export type UseEstimateMaxPriorityFeePerGasReturnType<
  selectData = EstimateMaxPriorityFeePerGasData,
> = UseQueryReturnType<selectData, EstimateMaxPriorityFeePerGasErrorType>

/** https://wagmi.sh/react/api/hooks/useEstimateMaxPriorityFeePerGas */
export function useEstimateMaxPriorityFeePerGas<
  config extends Config = ResolvedRegister['config'],
  selectData = EstimateMaxPriorityFeePerGasData,
>(
  parameters: UseEstimateMaxPriorityFeePerGasParameters<
    config,
    selectData
  > = {},
): UseEstimateMaxPriorityFeePerGasReturnType<selectData> {
  const config = useConfig(parameters)
  const chainId = useChainId()

  const queryOptions = computed(() => {
    const _parameters = cloneDeepUnref<
      DeepUnwrapRef<
        UseEstimateMaxPriorityFeePerGasParameters<config, selectData>
      >
    >(parameters as any)

    const { query = {} } = _parameters
    const options = estimateMaxPriorityFeePerGasQueryOptions(config, {
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
  ) as UseEstimateMaxPriorityFeePerGasReturnType<selectData>
}
