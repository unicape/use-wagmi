'use client'

import type { Config, GetTokenErrorType, ResolvedRegister } from '@wagmi/core'
import { type Evaluate } from '@wagmi/core/internal'
import {
  type GetTokenData,
  type GetTokenOptions,
  type GetTokenQueryFnData,
  type GetTokenQueryKey,
  getTokenQueryOptions,
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

export type UseTokenParameters<
  config extends Config = Config,
  selectData = GetTokenData,
> = MaybeRefDeep<
  Evaluate<
    GetTokenOptions<config> &
      ConfigParameter<config> &
      QueryParameter<
        GetTokenQueryFnData,
        GetTokenErrorType,
        selectData,
        GetTokenQueryKey<config>
      >
  >
>

export type UseTokenReturnType<selectData = GetTokenData> = UseQueryReturnType<
  selectData,
  GetTokenErrorType
>

/**
 * @deprecated
 *
 * https://wagmi.sh/react/api/hooks/useToken
 */
export function useToken<
  config extends Config = ResolvedRegister['config'],
  selectData = GetTokenData,
>(
  parameters: UseTokenParameters<config, selectData> = {},
): UseTokenReturnType<selectData> {
  const config = useConfig(parameters)
  const chainId = useChainId()

  const queryOptions = computed(() => {
    const _parameters = cloneDeepUnref<
      DeepUnwrapRef<UseTokenParameters<config, selectData>>
    >(parameters as any)

    const { address, query = {} } = _parameters
    const options = getTokenQueryOptions(config, {
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

  return useQuery(queryOptions as any) as UseTokenReturnType<selectData>
}
