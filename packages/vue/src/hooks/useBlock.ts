'use client'

import { type QueryFilters, useQueryClient } from '@tanstack/vue-query'
import {
  type Config,
  type GetBlockErrorType,
  type ResolvedRegister,
} from '@wagmi/core'
import {
  type Evaluate,
  type UnionEvaluate,
  type UnionOmit,
} from '@wagmi/core/internal'
import {
  type GetBlockData,
  type GetBlockOptions,
  type GetBlockQueryFnData,
  type GetBlockQueryKey,
  getBlockQueryOptions,
} from '@wagmi/core/query'
import type { BlockTag } from 'viem'

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
  type UseWatchBlocksParameters,
  useWatchBlocks,
} from './useWatchBlocks.js'

export type UseBlockParameters<
  includeTransactions extends boolean = false,
  blockTag extends BlockTag = 'latest',
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = GetBlockData,
> = MaybeRefDeep<
  Evaluate<
    GetBlockOptions<includeTransactions, blockTag, config, chainId> &
      ConfigParameter<config> &
      QueryParameter<
        GetBlockQueryFnData,
        GetBlockErrorType,
        selectData,
        GetBlockQueryKey<includeTransactions, blockTag, config, chainId>
      > & {
        watch?:
          | boolean
          | UnionEvaluate<
              UnionOmit<
                DeepUnwrapRef<
                  UseWatchBlocksParameters<
                    includeTransactions,
                    blockTag,
                    config,
                    chainId
                  >
                >,
                'chainId' | 'config' | 'onBlock' | 'onError'
              >
            >
          | undefined
      }
  >
>

export type UseBlockReturnType<
  includeTransactions extends boolean = false,
  blockTag extends BlockTag = 'latest',
  selectData = GetBlockData<includeTransactions, blockTag>,
> = UseQueryReturnType<selectData, GetBlockErrorType>

/** https://beta.wagmi.sh/react/hooks/useBlock */
export function useBlock<
  includeTransactions extends boolean = false,
  blockTag extends BlockTag = 'latest',
  config extends Config = ResolvedRegister['config'],
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = GetBlockData<includeTransactions, blockTag>,
>(
  parameters: UseBlockParameters<
    includeTransactions,
    blockTag,
    config,
    chainId,
    selectData
  > = {},
): UseBlockReturnType<includeTransactions, blockTag, selectData> {
  const config = useConfig(parameters)
  const queryClient = useQueryClient()
  const configChainId = useChainId()

  const queryOptions = computed(() => {
    const _parameters = cloneDeepUnref<
      DeepUnwrapRef<
        UseBlockParameters<
          includeTransactions,
          blockTag,
          config,
          chainId,
          selectData
        >
      >
    >(parameters as any)

    const { query = {} } = _parameters
    const chainId = _parameters.chainId ?? configChainId.value
    const options = getBlockQueryOptions(config, { chainId })
    const enabled = Boolean(query.enabled ?? true)

    return {
      ...query,
      ...options,
      enabled,
    }
  })

  const watchBlocksOptions = computed(() => {
    const _parameters = cloneDeepUnref<
      DeepUnwrapRef<
        UseBlockParameters<
          includeTransactions,
          blockTag,
          config,
          chainId,
          selectData
        >
      >
    >(parameters as any)

    const { query = {}, watch } = _parameters
    const enabled = Boolean(query.enabled ?? true)

    type OnBlock = DeepUnwrapRef<UseWatchBlocksParameters>['onBlock']
    const onBlock: OnBlock = (block) => {
      queryClient.setQueriesData(
        queryOptions.value.queryKey as QueryFilters,
        block,
      )
    }

    return {
      ...({
        config: _parameters.config,
        chainId: _parameters.chainId!,
        ...(typeof watch === 'object' ? watch : {}),
      } as UseWatchBlocksParameters),
      enabled: Boolean(
        enabled && (typeof watch === 'object' ? watch.enabled : watch),
      ),
      onBlock,
    }
  })

  useWatchBlocks(watchBlocksOptions)

  return useQuery(queryOptions as any) as UseBlockReturnType<
    includeTransactions,
    blockTag,
    selectData
  >
}
