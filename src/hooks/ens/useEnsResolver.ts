import { unref, computed } from 'vue-demi'
import { fetchEnsResolver } from '@wagmi/core'
import { useChainId, useQuery } from '../utils'

import type { UnwrapRef } from 'vue-demi'
import type { FetchEnsResolverArgs, FetchEnsResolverResult } from '@wagmi/core'
import type { DeepMaybeRef, QueryConfig, QueryFunctionArgs } from '../../types'

export type UseEnsResolverArgs = DeepMaybeRef<Partial<FetchEnsResolverArgs>>
export type UseEnsResolverConfig = QueryConfig<FetchEnsResolverResult, Error>

type QueryKeyArgs = UseEnsResolverArgs
type QueryKeyConfig = Pick<UseEnsResolverConfig, 'scopeKey'>

function queryKey ({
  chainId,
  name,
  scopeKey
}: QueryKeyArgs & QueryKeyConfig) {
  return [{ entity: 'ensName', chainId, name, scopeKey }] as const
}

function queryFn ({
  queryKey: [{ chainId, name }]
}: UnwrapRef<QueryFunctionArgs<typeof queryKey>>) {
  if (!name) throw new Error('name is required')
  return fetchEnsResolver({ chainId, name })
}

export function useEnsResolver ({
  chainId: chainId_,
  name,
  enabled = true,
  scopeKey,
  suspense,
  onError,
  onSettled,
  onSuccess
}: UseEnsResolverArgs & UseEnsResolverConfig = {}) {
  const chainId = useChainId({ chainId: chainId_ })

  return useQuery(
    queryKey({ chainId, name, scopeKey }),
    queryFn,
    {
      cacheTime: 0,
      enabled: computed(() => !!(unref(enabled) && unref(chainId) && unref(name))),
      suspense,
      onError,
      onSettled,
      onSuccess
    }
  )
}