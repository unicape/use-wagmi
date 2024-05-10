import type {
  Config,
  GetEnsResolverErrorType,
  ResolvedRegister,
} from '@wagmi/core'
import { type Evaluate } from '@wagmi/core/internal'
import {
  type GetEnsResolverData,
  type GetEnsResolverOptions,
  type GetEnsResolverQueryFnData,
  type GetEnsResolverQueryKey,
  getEnsResolverQueryOptions,
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

export type UseEnsResolverParameters<
  config extends Config = Config,
  selectData = GetEnsResolverData,
> = MaybeRefDeep<
  Evaluate<
    GetEnsResolverOptions<config> &
      ConfigParameter<config> &
      QueryParameter<
        GetEnsResolverQueryFnData,
        GetEnsResolverErrorType,
        selectData,
        GetEnsResolverQueryKey<config>
      >
  >
>

export type UseEnsResolverReturnType<selectData = GetEnsResolverData> =
  UseQueryReturnType<selectData, GetEnsResolverErrorType>

/** https://wagmi.sh/react/api/hooks/useEnsResolver */
export function useEnsResolver<
  config extends Config = ResolvedRegister['config'],
  selectData = GetEnsResolverData,
>(
  parameters: UseEnsResolverParameters<config, selectData> = {},
): UseEnsResolverReturnType<selectData> {
  const config = useConfig(parameters)
  const chainId = useChainId()

  const queryOptions = computed(() => {
    const _parameters = cloneDeepUnref<
      DeepUnwrapRef<UseEnsResolverParameters<config, selectData>>
    >(parameters as any)

    const { name, query = {} } = _parameters
    const options = getEnsResolverQueryOptions(config, {
      ..._parameters,
      chainId: _parameters.chainId ?? chainId.value,
    })
    const enabled = Boolean(name && (query.enabled ?? true))

    return {
      ...query,
      ...options,
      enabled,
    }
  })

  return useQuery(queryOptions as any) as UseEnsResolverReturnType<selectData>
}
