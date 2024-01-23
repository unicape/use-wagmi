'use client'

import {
  type Config,
  type PrepareTransactionRequestErrorType,
  type ResolvedRegister,
} from '@wagmi/core'
import {
  type PrepareTransactionRequestData,
  type PrepareTransactionRequestOptions,
  type PrepareTransactionRequestQueryKey,
  prepareTransactionRequestQueryOptions,
} from '@wagmi/core/query'
import type { PrepareTransactionRequestQueryFnData } from '@wagmi/core/query'
import { type PrepareTransactionRequestParameterType as viem_PrepareTransactionRequestParameterType } from 'viem'

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
  parameterType extends viem_PrepareTransactionRequestParameterType = viem_PrepareTransactionRequestParameterType,
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] | undefined = undefined,
  selectData = PrepareTransactionRequestData<parameterType, config, chainId>,
> = MaybeRefDeep<
  PrepareTransactionRequestOptions<parameterType, config, chainId> &
    ConfigParameter<config> &
    QueryParameter<
      PrepareTransactionRequestQueryFnData<parameterType, config, chainId>,
      PrepareTransactionRequestErrorType,
      selectData,
      PrepareTransactionRequestQueryKey<parameterType, config, chainId>
    >
>

export type UsePrepareTransactionRequestReturnType<
  parameterType extends viem_PrepareTransactionRequestParameterType = viem_PrepareTransactionRequestParameterType,
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] | undefined = undefined,
  selectData = PrepareTransactionRequestData<parameterType, config, chainId>,
> = UseQueryReturnType<selectData, PrepareTransactionRequestErrorType>

/** https://wagmi.sh/react/api/hooks/usePrepareTransactionRequest */
export function usePrepareTransactionRequest<
  parameterType extends viem_PrepareTransactionRequestParameterType,
  config extends Config = ResolvedRegister['config'],
  chainId extends config['chains'][number]['id'] | undefined = undefined,
  selectData = PrepareTransactionRequestData<parameterType, config, chainId>,
>(
  parameters: UsePrepareTransactionRequestParameters<
    parameterType,
    config,
    chainId,
    selectData
  > = {} as any,
): UsePrepareTransactionRequestReturnType<
  parameterType,
  config,
  chainId,
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
    parameterType,
    config,
    chainId,
    selectData
  >
}
