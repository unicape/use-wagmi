'use client'

import {
  type CallErrorType,
  type Config,
  type ResolvedRegister,
} from '@wagmi/core'
import type { Evaluate } from '@wagmi/core/internal'
import {
  type CallData,
  type CallOptions,
  type CallQueryKey,
  callQueryOptions,
} from '@wagmi/core/query'
import type { CallQueryFnData } from '@wagmi/core/query'

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

export type UseCallParameters<
  config extends Config = Config,
  selectData = CallData,
> = MaybeRefDeep<
  Evaluate<
    CallOptions<config> &
      ConfigParameter<config> &
      QueryParameter<
        CallQueryFnData,
        CallErrorType,
        selectData,
        CallQueryKey<config>
      >
  >
>

export type UseCallReturnType<selectData = CallData> = UseQueryReturnType<
  selectData,
  CallErrorType
>

/** https://wagmi.sh/react/api/hooks/useCall */
export function useCall<
  config extends Config = ResolvedRegister['config'],
  selectData = CallData,
>(
  parameters: UseCallParameters<config, selectData> = {},
): UseCallReturnType<selectData> {
  const config = useConfig(parameters)
  const chainId = useChainId()

  const queryOptions = computed(() => {
    const _parameters = cloneDeepUnref<
      DeepUnwrapRef<UseCallParameters<config, selectData>>
    >(parameters as any)

    const { query = {} } = _parameters
    const options = callQueryOptions(config, {
      ..._parameters,
      chainId: _parameters.chainId ?? chainId.value,
    })

    return {
      ...query,
      ...options,
    }
  })

  return useQuery(queryOptions as any) as UseCallReturnType<selectData>
}
