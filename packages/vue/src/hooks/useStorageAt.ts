'use client'

import {
  type Config,
  type GetStorageAtErrorType,
  type ResolvedRegister,
} from '@wagmi/core'
import type { Evaluate } from '@wagmi/core/internal'
import {
  type GetStorageAtData,
  type GetStorageAtOptions,
  type GetStorageAtQueryKey,
  getStorageAtQueryOptions,
} from '@wagmi/core/query'
import { type GetStorageAtQueryFnData } from '@wagmi/core/query'
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

export type UseStorageAtParameters<
  config extends Config = Config,
  selectData = GetStorageAtData,
> = MaybeRefDeep<
  Evaluate<
    GetStorageAtOptions<config> &
      ConfigParameter<config> &
      QueryParameter<
        GetStorageAtQueryFnData,
        GetStorageAtErrorType,
        selectData,
        GetStorageAtQueryKey<config>
      >
  >
>

export type UseStorageAtReturnType<selectData = GetStorageAtData> =
  UseQueryReturnType<selectData, GetStorageAtErrorType>

/** https://wagmi.sh/react/api/hooks/useStorageAt */
export function useStorageAt<
  config extends Config = ResolvedRegister['config'],
  selectData = GetStorageAtData,
>(
  parameters: UseStorageAtParameters<config, selectData> = {},
): UseStorageAtReturnType<selectData> {
  const config = useConfig(parameters)
  const chainId = useChainId()

  const queryOptions = computed(() => {
    const _parameters = cloneDeepUnref<
      DeepUnwrapRef<UseStorageAtParameters<config, selectData>>
    >(parameters as any)

    const { address, slot, query = {} } = _parameters
    const options = getStorageAtQueryOptions(config, {
      ..._parameters,
      chainId: _parameters.chainId ?? chainId.value,
    })
    const enabled = Boolean(address && slot && (query.enabled ?? true))

    return {
      ...query,
      ...options,
      enabled,
    }
  })

  return useQuery(queryOptions as any) as UseStorageAtReturnType<selectData>
}
