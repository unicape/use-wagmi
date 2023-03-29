import { unref, computed } from 'vue-demi'
import { fetchTransaction } from '@wagmi/core'
import { useChainId, useQuery } from '../utils'

import type { UnwrapRef } from 'vue-demi'
import type { FetchTransactionArgs, FetchTransactionResult } from '@wagmi/core'
import type { DeepMaybeRef, QueryConfig, QueryFunctionArgs } from '../../types'

export type UseTransactionArgs = DeepMaybeRef<Partial<FetchTransactionArgs>>
export type UseTransactionConfig = QueryConfig<FetchTransactionResult, Error>

type QueryKeyArgs = UseTransactionArgs
type QueryKeyConfig = Pick<UseTransactionConfig, 'scopeKey'>

function queryKey ({ chainId, hash, scopeKey }: QueryKeyArgs & QueryKeyConfig) {
  return [{ entity: 'transaction', chainId, hash, scopeKey }] as const
}

function queryFn({
  queryKey: [{ chainId, hash }]
}: UnwrapRef<QueryFunctionArgs<typeof queryKey>>) {
  if (!hash) throw new Error('hash is required')
  return fetchTransaction({ chainId, hash })
}

/**
 * @description Fetches transaction for hash
 *
 * @example
 * import { useTransaction } from 'use-wagmi'
 *
 * const result = useTransaction({
 *  chainId: 1,
 *  hash: '0x...',
 * })
 */
export function useTransaction ({
  cacheTime = 0,
  chainId: chainId_,
  enabled = true,
  hash,
  scopeKey,
  staleTime,
  suspense,
  onError,
  onSettled,
  onSuccess
}: UseTransactionArgs & UseTransactionConfig = {}) {
  const chainId = useChainId({ chainId: chainId_ })

  return useQuery(
    queryKey({ chainId, hash, scopeKey }),
    queryFn,
    {
      cacheTime,
      enabled: computed(() => !!(unref(enabled) && unref(hash))),
      staleTime,
      suspense,
      onError,
      onSettled,
      onSuccess
    }
  )
}