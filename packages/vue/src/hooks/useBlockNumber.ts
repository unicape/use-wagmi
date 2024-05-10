import { useQueryClient } from '@tanstack/vue-query'
import {
  type Config,
  type GetBlockNumberErrorType,
  type ResolvedRegister,
} from '@wagmi/core'
import {
  type Evaluate,
  type UnionEvaluate,
  type UnionOmit,
} from '@wagmi/core/internal'
import {
  type GetBlockNumberData,
  type GetBlockNumberOptions,
  type GetBlockNumberQueryFnData,
  type GetBlockNumberQueryKey,
  getBlockNumberQueryOptions,
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
import {
  type UseWatchBlockNumberParameters,
  useWatchBlockNumber,
} from './useWatchBlockNumber.js'

export type UseBlockNumberParameters<
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = GetBlockNumberData,
> = MaybeRefDeep<
  Evaluate<
    GetBlockNumberOptions<config, chainId> &
      ConfigParameter<config> &
      QueryParameter<
        GetBlockNumberQueryFnData,
        GetBlockNumberErrorType,
        selectData,
        GetBlockNumberQueryKey<config, chainId>
      > & {
        watch?:
          | boolean
          | UnionEvaluate<
              UnionOmit<
                DeepUnwrapRef<UseWatchBlockNumberParameters<config, chainId>>,
                'chainId' | 'config' | 'onBlockNumber' | 'onError'
              >
            >
          | undefined
      }
  >
>

export type UseBlockNumberReturnType<selectData = GetBlockNumberData> =
  UseQueryReturnType<selectData, GetBlockNumberErrorType>

/** https://wagmi.sh/react/api/hooks/useBlockNumber */
export function useBlockNumber<
  config extends Config = ResolvedRegister['config'],
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = GetBlockNumberData,
>(
  parameters: UseBlockNumberParameters<config, chainId, selectData> = {},
): UseBlockNumberReturnType<selectData> {
  const config = useConfig(parameters)
  const queryClient = useQueryClient()
  const configChainId = useChainId()

  const queryOptions = computed(() => {
    const _parameters = cloneDeepUnref<
      DeepUnwrapRef<UseBlockNumberParameters<config, chainId, selectData>>
    >(parameters as any)

    const { query = {} } = _parameters
    const chainId = _parameters.chainId ?? configChainId.value

    const options = getBlockNumberQueryOptions(config, {
      ..._parameters,
      chainId,
    })

    return {
      ...query,
      ...options,
    }
  })

  const watchBlockNumberOptions = computed(() => {
    const _parameters = cloneDeepUnref<
      DeepUnwrapRef<UseBlockNumberParameters<config, chainId, selectData>>
    >(parameters as any)
    const { query = {}, watch } = _parameters

    type OnBlockNumber =
      DeepUnwrapRef<UseWatchBlockNumberParameters>['onBlockNumber']
    const onBlockNumber: OnBlockNumber = (blockNumber) => {
      queryClient.setQueryData(queryOptions.value.queryKey, blockNumber)
    }

    return {
      ...({
        config: _parameters.config,
        chainId: _parameters.chainId,
        ...(typeof watch === 'object' ? watch : {}),
      } as UseWatchBlockNumberParameters),
      enabled: Boolean(
        (query.enabled ?? true) &&
          (typeof watch === 'object' ? watch.enabled : watch),
      ),
      onBlockNumber,
    }
  })

  useWatchBlockNumber(watchBlockNumberOptions)

  return useQuery(queryOptions as any) as UseBlockNumberReturnType<selectData>
}
