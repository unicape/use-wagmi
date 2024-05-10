import { useQueryClient } from '@tanstack/vue-query'
import type {
  Config,
  Connector,
  GetConnectorClientErrorType,
  ResolvedRegister,
} from '@wagmi/core'
import { type Evaluate, type Omit } from '@wagmi/core/internal'
import {
  type GetConnectorClientData,
  type GetConnectorClientOptions,
  type GetConnectorClientQueryFnData,
  type GetConnectorClientQueryKey,
  getConnectorClientQueryOptions,
} from '@wagmi/core/query'
import { computed, watchEffect } from 'vue-demi'

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

export type UseConnectorClientParameters<
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = GetConnectorClientData<config, chainId>,
> = MaybeRefDeep<
  Evaluate<
    GetConnectorClientOptions<config, chainId> &
      ConfigParameter<config> & {
        query?:
          | Evaluate<
              Omit<
                DeepUnwrapRef<
                  UseQueryParameters<
                    GetConnectorClientQueryFnData<config, chainId>,
                    GetConnectorClientErrorType,
                    selectData,
                    GetConnectorClientQueryKey<config, chainId>
                  >
                >,
                'gcTime' | 'staleTime'
              >
            >
          | undefined
      }
  >
>

export type UseConnectorClientReturnType<
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = GetConnectorClientData<config, chainId>,
> = UseQueryReturnType<selectData, GetConnectorClientErrorType>

/** https://wagmi.sh/react/api/hooks/useConnectorClient */
export function useConnectorClient<
  config extends Config = ResolvedRegister['config'],
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = GetConnectorClientData<config, chainId>,
>(
  parameters: UseConnectorClientParameters<config, chainId, selectData> = {},
): UseConnectorClientReturnType<config, chainId, selectData> {
  const config = useConfig(parameters)
  const queryClient = useQueryClient()
  const { address, connector, status } = useAccount()
  const chainId = useChainId()

  const queryOptions = computed(() => {
    const _parameters = cloneDeepUnref<
      DeepUnwrapRef<UseConnectorClientParameters<config, chainId, selectData>>
    >(parameters as any)
    const { query } = _parameters

    const options = getConnectorClientQueryOptions<config, chainId>(config, {
      ..._parameters,
      chainId: _parameters.chainId ?? chainId.value,
      connector: (_parameters.connector ?? connector.value) as Connector,
    })

    return {
      ...query,
      ...options,
      enabled: computed(
        () => (status.value !== 'disconnected' && query?.enabled) ?? true,
      ),
      staleTime: Infinity,
    }
  })

  watchEffect(() => {
    // invalidate when address changes
    const queryKey = queryOptions.value.queryKey
    if (address) queryClient.invalidateQueries({ queryKey })
    else queryClient.removeQueries({ queryKey }) // remove when account is disconnected
  })

  return useQuery(queryOptions as any) as UseConnectorClientReturnType<
    config,
    chainId,
    selectData
  >
}
