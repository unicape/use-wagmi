'use client'

import {
  type Config,
  type GetGasPriceErrorType,
  type ResolvedRegister,
} from '@wagmi/core'
import { type Evaluate } from '@wagmi/core/internal'
import {
  type GetGasPriceData,
  type GetGasPriceOptions,
  type GetGasPriceQueryFnData,
  type GetGasPriceQueryKey,
  getGasPriceQueryOptions,
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

export type UseGasPriceParameters<
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = GetGasPriceData,
> = MaybeRefDeep<
  Evaluate<
    GetGasPriceOptions<config, chainId> &
      ConfigParameter<config> &
      QueryParameter<
        GetGasPriceQueryFnData,
        GetGasPriceErrorType,
        selectData,
        GetGasPriceQueryKey<config, chainId>
      >
  >
>

export type UseGasPriceReturnType<selectData = GetGasPriceData> =
  UseQueryReturnType<selectData, GetGasPriceErrorType>

/** https://wagmi.sh/react/api/hooks/useGasPrice */
export function useGasPrice<
  config extends Config = ResolvedRegister['config'],
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = GetGasPriceData,
>(
  parameters: UseGasPriceParameters<config, chainId, selectData> = {},
): UseGasPriceReturnType<selectData> {
  const config = useConfig(parameters)
  const chainId = useChainId()

  const queryOptions = computed(() => {
    const _parameters = cloneDeepUnref<
      DeepUnwrapRef<UseGasPriceParameters<config, chainId, selectData>>
    >(parameters as any)

    const { query = {} } = _parameters
    const options = getGasPriceQueryOptions(config, {
      ..._parameters,
      chainId: _parameters.chainId ?? chainId.value,
    })

    return {
      ...query,
      ...options,
    }
  })

  return useQuery(queryOptions as any) as UseGasPriceReturnType<selectData>
}
