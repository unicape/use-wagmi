'use client'

import {
  type Config,
  type GetBalanceErrorType,
  type ResolvedRegister,
} from '@wagmi/core'
import type { Evaluate } from '@wagmi/core/internal'
import {
  type GetBalanceData,
  type GetBalanceOptions,
  type GetBalanceQueryKey,
  getBalanceQueryOptions,
} from '@wagmi/core/query'
import type { GetBalanceQueryFnData } from '@wagmi/core/query'
import { computed, unref } from 'vue-demi'

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

export type UseBalanceParameters<
  config extends Config = Config,
  selectData = GetBalanceData,
> = MaybeRefDeep<
  Evaluate<
    GetBalanceOptions<config> &
      ConfigParameter<config> &
      QueryParameter<
        GetBalanceQueryFnData,
        GetBalanceErrorType,
        selectData,
        GetBalanceQueryKey<config>
      >
  >
>

export type UseBalanceReturnType<selectData = GetBalanceData> =
  UseQueryReturnType<selectData, GetBalanceErrorType>

/** https://beta.wagmi.sh/react/api/hooks/useBalance */
export function useBalance<
  config extends Config = ResolvedRegister['config'],
  selectData = GetBalanceData,
>(parameters: UseBalanceParameters<config, selectData> = {}) {
  const config = useConfig(parameters)
  const chainId = useChainId()

  const queryOptions = computed(() => {
    const { config: _, ...params } = unref(parameters)
    const clonedParameters = cloneDeepUnref<
      Omit<DeepUnwrapRef<UseBalanceParameters>, 'config'>
    >(params as any)

    const options = getBalanceQueryOptions(config, {
      ...clonedParameters,
      chainId: clonedParameters.chainId ?? unref(chainId),
    })

    const { address, query = {} } = clonedParameters

    const enabled = Boolean(address && (query.enabled ?? true))

    return {
      ...query,
      ...options,
      enabled,
    }
  })

  return useQuery(queryOptions as any) as UseBalanceReturnType<selectData>
}
