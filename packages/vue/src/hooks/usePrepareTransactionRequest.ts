'use client'

import {
  type Config,
  type PrepareTransactionRequestErrorType,
  type ResolvedRegister,
  type SelectChains,
} from '@wagmi/core'
import {
  type PrepareTransactionRequestData,
  type PrepareTransactionRequestOptions,
  type PrepareTransactionRequestQueryKey,
  prepareTransactionRequestQueryOptions,
} from '@wagmi/core/query'
import type { PrepareTransactionRequestQueryFnData } from '@wagmi/core/query'
import { type PrepareTransactionRequestRequest as viem_PrepareTransactionRequestRequest } from 'viem'

import { computed } from 'vue-demi'
import {
  type ConfigParameter,
  type MaybeRefDeep,
  type QueryParameter,
} from '../types.js'
import { cloneDeepUnref } from '../utils/cloneDeepUnref.js'
import { type UseQueryReturnType, useQuery } from '../utils/query.js'
import { useChainId } from './useChainId.js'
import { useConfig } from './useConfig.js'

export type UsePrepareTransactionRequestParameters<
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] | undefined = undefined,
  request extends viem_PrepareTransactionRequestRequest<
    SelectChains<config, chainId>[0],
    SelectChains<config, chainId>[0]
  > = viem_PrepareTransactionRequestRequest<
    SelectChains<config, chainId>[0],
    SelectChains<config, chainId>[0]
  >,
  selectData = PrepareTransactionRequestData<config, chainId, request>,
> = MaybeRefDeep<
  PrepareTransactionRequestOptions<config, chainId, request> &
    ConfigParameter<config> &
    QueryParameter<
      PrepareTransactionRequestQueryFnData<config, chainId, request>,
      PrepareTransactionRequestErrorType,
      selectData,
      PrepareTransactionRequestQueryKey<config, chainId, request>
    >
>

export type UsePrepareTransactionRequestReturnType<
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] | undefined = undefined,
  request extends viem_PrepareTransactionRequestRequest<
    SelectChains<config, chainId>[0],
    SelectChains<config, chainId>[0]
  > = viem_PrepareTransactionRequestRequest<
    SelectChains<config, chainId>[0],
    SelectChains<config, chainId>[0]
  >,
  selectData = PrepareTransactionRequestData<config, chainId, request>,
> = UseQueryReturnType<selectData, PrepareTransactionRequestErrorType>

/** https://wagmi.sh/react/api/hooks/usePrepareTransactionRequest */
export function usePrepareTransactionRequest<
  config extends Config = ResolvedRegister['config'],
  chainId extends config['chains'][number]['id'] | undefined = undefined,
  request extends viem_PrepareTransactionRequestRequest<
    SelectChains<config, chainId>[0],
    SelectChains<config, chainId>[0]
  > = viem_PrepareTransactionRequestRequest<
    SelectChains<config, chainId>[0],
    SelectChains<config, chainId>[0]
  >,
  selectData = PrepareTransactionRequestData<config, chainId, request>,
>(
  parameters: UsePrepareTransactionRequestParameters<
    config,
    chainId,
    request,
    selectData
  > = {} as any,
): UsePrepareTransactionRequestReturnType<
  config,
  chainId,
  request,
  selectData
> {
  const config = useConfig(parameters)
  const chainId = useChainId()

  const queryOptions = computed(() => {
    const _parameters = cloneDeepUnref(parameters)

    const { to, query = {} } = _parameters
    const options = prepareTransactionRequestQueryOptions(config, {
      ..._parameters,
      chainId: _parameters.chainId ?? chainId.value,
    })
    const enabled = Boolean(to && (query.enabled ?? true))

    return {
      ...query,
      ...options,
      enabled,
    }
  })

  return useQuery(
    queryOptions as any,
  ) as UsePrepareTransactionRequestReturnType<
    config,
    chainId,
    request,
    selectData
  >
}
