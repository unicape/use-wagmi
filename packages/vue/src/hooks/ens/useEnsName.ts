import { unref, computed } from 'vue-demi'
import { fetchEnsName } from '@wagmi/core'
import { useChainId, useQuery } from '../utils'

import type { UnwrapRef } from 'vue-demi'
import type { FetchEnsNameArgs, FetchEnsNameResult } from '@wagmi/core'
import type { DeepMaybeRef, QueryConfig, QueryFunctionArgs } from '../../types'

export type UseEnsNameArgs = DeepMaybeRef<Partial<FetchEnsNameArgs>>
export type UseEnsNameConfig = QueryConfig<FetchEnsNameResult, Error>

type QueryKeyArgs = UseEnsNameArgs
type QueryKeyConfig = Pick<UseEnsNameConfig, 'scopeKey'>

function queryKey ({
  address,
  chainId,
  scopeKey
}: QueryKeyArgs & QueryKeyConfig) {
  return [{ entity: 'ensName', address, chainId, scopeKey }] as const
}

function queryFn ({
  queryKey: [{ address, chainId }]
}: UnwrapRef<QueryFunctionArgs<typeof queryKey>>) {
  if (!address) throw new Error('address is required')
  return fetchEnsName({ address, chainId })
}

export function useEnsName ({
  address,
  cacheTime,
  chainId: chainId_,
  enabled = true,
  scopeKey,
  staleTime = 1_000 * 60 * 60 * 24, // 24 hours
  suspense,
  onError,
  onSettled,
  onSuccess
}: UseEnsNameArgs & UseEnsNameConfig = {}) {
  const chainId = useChainId({ chainId: chainId_ })

  return useQuery(
    queryKey({ address, chainId, scopeKey }),
    queryFn,
    {
      cacheTime,
      enabled: computed(() => !!(unref(enabled) && unref(address) && unref(chainId))),
      staleTime,
      suspense,
      onError,
      onSettled,
      onSuccess
    }
  )
}