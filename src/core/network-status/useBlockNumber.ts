import { watchEffect, unref } from 'vue-demi'
import { fetchBlockNumber } from '@wagmi/core'
import { debounce } from '@wagmi/core/internal'
import { useProvider, useWebSocketProvider } from 'use-wagmi'
import { useChainId, useQuery, useQueryClient } from '../../utils'

import type { FetchBlockNumberArgs, FetchBlockNumberResult } from '@wagmi/core'
import type { QueryConfig, QueryFunctionArgs, SetMaybeRef } from './../../types'

export type UseBlockNumberArgs = Partial<FetchBlockNumberArgs> & {
  /** Function fires when a new block is created */
  onBlock?: (blockNumber: number) => void
  /** Subscribe to changes */
  watch?: boolean
}

export type UseBlockNumberConfig = QueryConfig<FetchBlockNumberResult, Error>

type QueryKeyArgs = Partial<FetchBlockNumberArgs>
type QueryKeyConfig = Pick<UseBlockNumberConfig, 'scopeKey'>

function queryKey ({ chainId, scopeKey }: QueryKeyArgs & QueryKeyConfig) {
  return [{ entity: 'blockNumber', chainId, scopeKey }] as const
}

function queryFn ({
  queryKey: [{ chainId }],
}: QueryFunctionArgs<typeof queryKey>) {
  return fetchBlockNumber({ chainId })
}

export function useBlockNumber ({
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
  onSuccess
}: SetMaybeRef<UseBlockNumberArgs> & UseBlockNumberConfig = {}) {
  const chainId = useChainId({ chainId: chainId_ })
  const provider = useProvider({ chainId })
  const websocketProvider = useWebSocketProvider({ chainId })
  const queryClient = useQueryClient()

  watchEffect(onCleanup => {
    if (!unref(enabled)) return
    if (!unref(watch) && !onBlock) return

    // We need to debounce the listener as we want to opt-out
    // of the behavior where ethers emits a "block" event for
    // every block that was missed in between the `pollingInterval`.
    // We are setting a wait time of 1 as emitting an event in
    // ethers takes ~0.1ms.
    const listener = debounce((blockNumber: number) => {
      // Just to be safe in case the provider implementation
      // calls the event callback after .off() has been called
      if (unref(watch))
        queryClient.setQueriesData(queryKey({
          chainId: unref(chainId),
          scopeKey: unref(scopeKey)
        }), blockNumber)
      if (onBlock) onBlock(blockNumber)
    }, 1)

    const provider_ = websocketProvider.value ?? provider.value
    provider_.on('block', listener)

    onCleanup(() => provider_.off('block', listener))
  })

  return useQuery(
    queryKey({
      scopeKey: unref(scopeKey),
      chainId: unref(chainId)
    }),
    queryFn,
    {
      cacheTime: unref(cacheTime),
      enabled: unref(enabled),
      staleTime: unref(staleTime),
      suspense: unref(suspense),
      onError,
      onSettled,
      onSuccess
    }
  )
}