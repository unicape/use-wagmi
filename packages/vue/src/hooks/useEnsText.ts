'use client'

import type { Config, GetEnsTextErrorType, ResolvedRegister } from '@wagmi/core'
import { type Evaluate } from '@wagmi/core/internal'
import {
  type GetEnsTextData,
  type GetEnsTextOptions,
  type GetEnsTextQueryFnData,
  type GetEnsTextQueryKey,
  getEnsTextQueryOptions,
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

export type UseEnsTextParameters<
  config extends Config = Config,
  selectData = GetEnsTextData,
> = MaybeRefDeep<
  Evaluate<
    GetEnsTextOptions<config> &
      ConfigParameter<config> &
      QueryParameter<
        GetEnsTextQueryFnData,
        GetEnsTextErrorType,
        selectData,
        GetEnsTextQueryKey<config>
      >
  >
>

export type UseEnsTextReturnType<selectData = GetEnsTextData> =
  UseQueryReturnType<selectData, GetEnsTextErrorType>

/** https://wagmi.sh/react/api/hooks/useEnsText */
export function useEnsText<
  config extends Config = ResolvedRegister['config'],
  selectData = GetEnsTextData,
>(
  parameters: UseEnsTextParameters<config, selectData> = {},
): UseEnsTextReturnType<selectData> {
  const config = useConfig(parameters)
  const chainId = useChainId()

  const queryOptions = computed(() => {
    const _parameters = cloneDeepUnref<
      DeepUnwrapRef<UseEnsTextParameters<config, selectData>>
    >(parameters as any)

    const { key, name, query = {} } = _parameters
    const options = getEnsTextQueryOptions(config, {
      ..._parameters,
      chainId: _parameters.chainId ?? chainId.value,
    })
    const enabled = Boolean(key && name && (query.enabled ?? true))

    return {
      ...query,
      ...options,
      enabled,
    }
  })

  return useQuery(queryOptions as any) as UseEnsTextReturnType<selectData>
}
