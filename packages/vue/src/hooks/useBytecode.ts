'use client'

import {
  type Config,
  type GetBytecodeErrorType,
  type ResolvedRegister,
} from '@wagmi/core'
import type { Evaluate } from '@wagmi/core/internal'
import {
  type GetBytecodeData,
  type GetBytecodeOptions,
  type GetBytecodeQueryKey,
  getBytecodeQueryOptions,
} from '@wagmi/core/query'
import { type GetBytecodeQueryFnData } from '@wagmi/core/query'
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

export type UseBytecodeParameters<
  config extends Config = Config,
  selectData = GetBytecodeData,
> = MaybeRefDeep<
  Evaluate<
    GetBytecodeOptions<config> &
      ConfigParameter<config> &
      QueryParameter<
        GetBytecodeQueryFnData,
        GetBytecodeErrorType,
        selectData,
        GetBytecodeQueryKey<config>
      >
  >
>

export type UseBytecodeReturnType<selectData = GetBytecodeData> =
  UseQueryReturnType<selectData, GetBytecodeErrorType>

/** https://wagmi.sh/react/api/hooks/useBytecode */
export function useBytecode<
  config extends Config = ResolvedRegister['config'],
  selectData = GetBytecodeData,
>(
  parameters: UseBytecodeParameters<config, selectData> = {},
): UseBytecodeReturnType<selectData> {
  const config = useConfig(parameters)
  const chainId = useChainId()

  const queryOptions = computed(() => {
    const _parameters = cloneDeepUnref<
      DeepUnwrapRef<UseBytecodeParameters<config, selectData>>
    >(parameters as any)

    const { address, query = {} } = _parameters
    const options = getBytecodeQueryOptions(config, {
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

  return useQuery(queryOptions as any) as UseBytecodeReturnType<selectData>
}
