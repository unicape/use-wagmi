'use client'

import {
  type Config,
  type GetTransactionCountErrorType,
  type ResolvedRegister,
} from '@wagmi/core'
import type { Evaluate } from '@wagmi/core/internal'
import type { GetTransactionCountQueryFnData } from '@wagmi/core/query'
import {
  type GetTransactionCountData,
  type GetTransactionCountOptions,
  type GetTransactionCountQueryKey,
  getTransactionCountQueryOptions,
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

export type UseTransactionCountParameters<
  config extends Config = Config,
  selectData = GetTransactionCountData,
> = MaybeRefDeep<
  Evaluate<
    GetTransactionCountOptions<config> &
      ConfigParameter<config> &
      QueryParameter<
        GetTransactionCountQueryFnData,
        GetTransactionCountErrorType,
        selectData,
        GetTransactionCountQueryKey<config>
      >
  >
>

export type UseTransactionCountReturnType<
  selectData = GetTransactionCountData,
> = UseQueryReturnType<selectData, GetTransactionCountErrorType>

/** https://wagmi.sh/react/api/hooks/useTransactionCount */
export function useTransactionCount<
  config extends Config = ResolvedRegister['config'],
  selectData = GetTransactionCountData,
>(
  parameters: UseTransactionCountParameters<config, selectData> = {},
): UseTransactionCountReturnType<selectData> {
  const config = useConfig(parameters)
  const chainId = useChainId()

  const queryOptions = computed(() => {
    const _parameters = cloneDeepUnref<
      DeepUnwrapRef<UseTransactionCountParameters<config, selectData>>
    >(parameters as any)

    const { address, query = {} } = _parameters
    const options = getTransactionCountQueryOptions(config, {
      ..._parameters,
      chainId: _parameters.chainId ?? chainId.value,
    })
    const enabled = Boolean(address && (query.enabled ?? true))

    return {
      ...query,
      ...options,
      enabled,
    }
  })

  return useQuery(
    queryOptions as any,
  ) as UseTransactionCountReturnType<selectData>
}
