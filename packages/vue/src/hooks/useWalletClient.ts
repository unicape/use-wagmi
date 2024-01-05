'use client'

// Almost identical implementation to `useConnectorClient` (except for return type)
// Should update both in tandem

import { useQueryClient } from '@tanstack/vue-query'
import type {
  Config,
  GetWalletClientErrorType,
  ResolvedRegister,
} from '@wagmi/core'
import { type Evaluate, type Omit } from '@wagmi/core/internal'
import {
  type GetWalletClientData,
  type GetWalletClientOptions,
  type GetWalletClientQueryFnData,
  type GetWalletClientQueryKey,
  getWalletClientQueryOptions,
} from '@wagmi/core/query'

import { computed, unref, watch } from 'vue-demi'
import type { ConfigParameter, DeepUnwrapRef, MaybeRefDeep } from '../types.js'
import { cloneDeepUnref } from '../utils/cloneDeepUnref.js'
import {
  type UseQueryParameters,
  type UseQueryReturnType,
  useQuery,
} from '../utils/query.js'
import { useAccount } from './useAccount.js'
import { useChainId } from './useChainId.js'
import { useConfig } from './useConfig.js'

export type UseWalletClientParameters<
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = GetWalletClientData<config, chainId>,
> = MaybeRefDeep<
  Evaluate<
    GetWalletClientOptions<config, chainId> &
      ConfigParameter<config> & {
        query?:
          | Evaluate<
              Omit<
                DeepUnwrapRef<
                  UseQueryParameters<
                    GetWalletClientQueryFnData<config, chainId>,
                    GetWalletClientErrorType,
                    selectData,
                    GetWalletClientQueryKey<config, chainId>
                  >
                >,
                'gcTime' | 'staleTime'
              >
            >
          | undefined
      }
  >
>

export type UseWalletClientReturnType<
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = GetWalletClientData<config, chainId>,
> = UseQueryReturnType<selectData, GetWalletClientErrorType>

/** https://wagmi.sh/react/api/hooks/useWalletClient */
export function useWalletClient<
  config extends Config = ResolvedRegister['config'],
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = GetWalletClientData<config, chainId>,
>(
  parameters: UseWalletClientParameters<config, chainId, selectData> = {},
): UseWalletClientReturnType<config, chainId, selectData> {
  const config = useConfig(parameters)
  const queryClient = useQueryClient()
  const { address, connector, status } = useAccount()
  const chainId = useChainId()

  const queryOptions = computed(() => {
    const _parameters = cloneDeepUnref<
      DeepUnwrapRef<UseWalletClientParameters<config, chainId, selectData>>
    >(parameters as any)

    const { query = {} } = _parameters

    const { queryKey, ...options } = getWalletClientQueryOptions<
      config,
      chainId
    >(config, {
      ..._parameters,
      chainId: _parameters.chainId ?? chainId.value,
      connector: _parameters.connector ?? connector.value,
    } as GetWalletClientOptions<config, chainId>)
    const enabled = Boolean(
      status.value !== 'disconnected' && (query.enabled ?? true),
    )

    return {
      ...query,
      ...options,
      queryKey,
      enabled,
      staleTime: Infinity,
    }
  })

  watch([address, queryClient], () => {
    // invalidate when address changes
    if (unref(address))
      queryClient.invalidateQueries({ queryKey: queryOptions.value.queryKey })
    else queryClient.removeQueries({ queryKey: queryOptions.value.queryKey }) // remove when account is disconnected
  })

  return useQuery(queryOptions as any) as UseWalletClientReturnType<
    config,
    chainId,
    selectData
  >
}
