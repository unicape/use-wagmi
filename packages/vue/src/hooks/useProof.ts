'use client'

import {
  type Config,
  type GetProofErrorType,
  type ResolvedRegister,
} from '@wagmi/core'
import type { Evaluate } from '@wagmi/core/internal'
import {
  type GetProofData,
  type GetProofOptions,
  type GetProofQueryKey,
  getProofQueryOptions,
} from '@wagmi/core/query'
import { type GetProofQueryFnData } from '@wagmi/core/query'

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

export type UseProofParameters<
  config extends Config = Config,
  selectData = GetProofData,
> = MaybeRefDeep<
  Evaluate<
    GetProofOptions<config> &
      ConfigParameter<config> &
      QueryParameter<
        GetProofQueryFnData,
        GetProofErrorType,
        selectData,
        GetProofQueryKey<config>
      >
  >
>

export type UseProofReturnType<selectData = GetProofData> = UseQueryReturnType<
  selectData,
  GetProofErrorType
>

/** https://wagmi.sh/react/api/hooks/useProof */
export function useProof<
  config extends Config = ResolvedRegister['config'],
  selectData = GetProofData,
>(
  parameters: UseProofParameters<config, selectData> = {},
): UseProofReturnType<selectData> {
  const config = useConfig(parameters)
  const chainId = useChainId()

  const queryOptions = computed(() => {
    const _parameters =
      cloneDeepUnref<DeepUnwrapRef<UseProofParameters<config, selectData>>>(
        parameters,
      )

    const { address, storageKeys, query = {} } = _parameters

    const options = getProofQueryOptions(config, {
      ..._parameters,
      chainId: _parameters.chainId ?? chainId.value,
    })
    const enabled = Boolean(address && storageKeys && (query.enabled ?? true))

    return {
      ...query,
      ...options,
      enabled,
    }
  })

  return useQuery(queryOptions as any) as UseProofReturnType<selectData>
}
