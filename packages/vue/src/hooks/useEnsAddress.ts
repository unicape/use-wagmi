'use client'

import type {
  Config,
  GetEnsAddressErrorType,
  ResolvedRegister,
} from '@wagmi/core'
import { type Evaluate } from '@wagmi/core/internal'
import {
  type GetEnsAddressData,
  type GetEnsAddressOptions,
  type GetEnsAddressQueryFnData,
  type GetEnsAddressQueryKey,
  getEnsAddressQueryOptions,
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

export type UseEnsAddressParameters<
  config extends Config = Config,
  selectData = GetEnsAddressData,
> = MaybeRefDeep<
  Evaluate<
    GetEnsAddressOptions<config> &
      ConfigParameter<config> &
      QueryParameter<
        GetEnsAddressQueryFnData,
        GetEnsAddressErrorType,
        selectData,
        GetEnsAddressQueryKey<config>
      >
  >
>

export type UseEnsAddressReturnType<selectData = GetEnsAddressData> =
  UseQueryReturnType<selectData, GetEnsAddressErrorType>

/** https://beta.wagmi.sh/react/api/hooks/useEnsAddress */
export function useEnsAddress<
  config extends Config = ResolvedRegister['config'],
  selectData = GetEnsAddressData,
>(
  parameters: UseEnsAddressParameters<config, selectData> = {},
): UseEnsAddressReturnType<selectData> {
  const config = useConfig(parameters)
  const chainId = useChainId()

  const queryOptions = computed(() => {
    const _parameters = cloneDeepUnref<
      DeepUnwrapRef<UseEnsAddressParameters<config, selectData>>
    >(parameters as any)

    const { name, query = {} } = _parameters
    const options = getEnsAddressQueryOptions(config, {
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

  return useQuery(queryOptions as any) as UseEnsAddressReturnType<selectData>
}
