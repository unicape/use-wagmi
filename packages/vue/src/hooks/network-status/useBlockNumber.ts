import { fetchBlockNumber } from '@wagmi/core'
import type { FetchBlockNumberArgs, FetchBlockNumberResult } from '@wagmi/core'
import { unref, watchEffect } from 'vue-demi'
import type { UnwrapRef } from 'vue-demi'

import type {
  DeepMaybeRef,
  QueryConfig,
  QueryFunctionArgs,
} from './../../types'
import { useChainId, useQuery, useQueryClient } from '../utils'
import { usePublicClient, useWebSocketPublicClient } from '../viem'

export type UseBlockNumberArgs = DeepMaybeRef<
  Partial<FetchBlockNumberArgs> & {
    /** Subscribe to changes */
    watch?: boolean
  }
> & {
  /** Function fires when a new block is created */
  onBlock?: (blockNumber: bigint) => void
}

export type UseBlockNumberConfig = QueryConfig<FetchBlockNumberResult, Error>

type QueryKeyArgs = DeepMaybeRef<Partial<FetchBlockNumberArgs>>
type QueryKeyConfig = Pick<UseBlockNumberConfig, 'scopeKey'>

function queryKey({ chainId, scopeKey }: QueryKeyArgs & QueryKeyConfig) {
  return [{ entity: 'blockNumber', chainId, scopeKey }] as const
}

function queryFn({
  queryKey: [{ chainId }],
}: UnwrapRef<QueryFunctionArgs<typeof queryKey>>) {
  return fetchBlockNumber({ chainId })
}

export function useBlockNumber({
  cacheTime = 0,
  chainId: chainId_,
  enabled = true,
  scopeKey,
  staleTime,
  suspense,
  watch = false,
  onBlock,
  onError,
  onSettled,
  onSuccess,
}: UseBlockNumberArgs & UseBlockNumberConfig = {}) {
  const chainId = useChainId({ chainId: chainId_ })
  const publicClient = usePublicClient({ chainId })
  const webSocketPublicClient = useWebSocketPublicClient({ chainId })
  const queryClient = useQueryClient()

  watchEffect((onCleanup) => {
    if (!unref(enabled)) return
    if (!unref(watch) && !onBlock) return

    const publicClient_ = webSocketPublicClient.value ?? publicClient.value
    const unwatch = publicClient_.watchBlockNumber({
      onBlockNumber: (blockNumber) => {
        if (watch)
          queryClient.setQueryData(queryKey({ chainId, scopeKey }), blockNumber)
        if (onBlock) onBlock(blockNumber)
      },
      emitOnBegin: true,
    })
    onCleanup(() => unwatch())
  })

  return useQuery(
    queryKey({
      scopeKey,
      chainId,
    }),
    queryFn,
    {
      cacheTime,
      enabled,
      staleTime,
      suspense,
      onError,
      onSettled,
      onSuccess,
    },
  )
}
