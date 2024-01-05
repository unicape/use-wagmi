'use client'

import type {
  Config,
  GetEnsAvatarErrorType,
  ResolvedRegister,
} from '@wagmi/core'
import { type Evaluate } from '@wagmi/core/internal'
import {
  type GetEnsAvatarData,
  type GetEnsAvatarOptions,
  type GetEnsAvatarQueryFnData,
  type GetEnsAvatarQueryKey,
  getEnsAvatarQueryOptions,
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

export type UseEnsAvatarParameters<
  config extends Config = Config,
  selectData = GetEnsAvatarData,
> = MaybeRefDeep<
  Evaluate<
    GetEnsAvatarOptions<config> &
      ConfigParameter<config> &
      QueryParameter<
        GetEnsAvatarQueryFnData,
        GetEnsAvatarErrorType,
        selectData,
        GetEnsAvatarQueryKey<config>
      >
  >
>

export type UseEnsAvatarReturnType<selectData = GetEnsAvatarData> =
  UseQueryReturnType<selectData, GetEnsAvatarErrorType>

/** https://wagmi.sh/react/api/hooks/useEnsAvatar */
export function useEnsAvatar<
  config extends Config = ResolvedRegister['config'],
  selectData = GetEnsAvatarData,
>(
  parameters: UseEnsAvatarParameters<config, selectData> = {},
): UseEnsAvatarReturnType<selectData> {
  const config = useConfig(parameters)
  const chainId = useChainId()

  const queryOptopns = computed(() => {
    const _parameters = cloneDeepUnref<
      DeepUnwrapRef<UseEnsAvatarParameters<config, selectData>>
    >(parameters as any)

    const { name, query = {} } = _parameters
    const options = getEnsAvatarQueryOptions(config, {
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

  return useQuery(queryOptopns as any) as UseEnsAvatarReturnType<selectData>
}
