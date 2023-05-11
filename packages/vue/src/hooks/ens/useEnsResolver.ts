import { fetchEnsResolver } from '@wagmi/core'
import type { FetchEnsResolverArgs, FetchEnsResolverResult } from '@wagmi/core'
import type { UnwrapRef } from 'vue-demi'
import { computed, unref } from 'vue-demi'

import type { DeepMaybeRef, QueryConfig, QueryFunctionArgs } from '../../types'
import { useChainId, useQuery } from '../utils'

export type UseEnsResolverArgs = DeepMaybeRef<
  Omit<Partial<FetchEnsResolverArgs>, 'name'> & {
    name?: FetchEnsResolverArgs['name'] | null
  }
>
export type UseEnsResolverConfig = QueryConfig<FetchEnsResolverResult, Error>

type QueryKeyArgs = UseEnsResolverArgs
type QueryKeyConfig = Pick<UseEnsResolverConfig, 'scopeKey'>

function queryKey({ chainId, name, scopeKey }: QueryKeyArgs & QueryKeyConfig) {
  return [
    { entity: 'ensResolver', chainId, name, scopeKey, persist: false },
  ] as const
}

function queryFn({
  queryKey: [{ chainId, name }],
}: UnwrapRef<QueryFunctionArgs<typeof queryKey>>) {
  if (!name) throw new Error('name is required')
  return fetchEnsResolver({ chainId, name })
}

export function useEnsResolver({
  chainId: chainId_,
  name,
  enabled = true,
  scopeKey,
  suspense,
  onError,
  onSettled,
  onSuccess,
}: UseEnsResolverArgs & UseEnsResolverConfig = {}) {
  const chainId = useChainId({ chainId: chainId_ })

  return useQuery(queryKey({ chainId, name, scopeKey }), queryFn, {
    cacheTime: 0,
    enabled: computed(
      () => !!(unref(enabled) && unref(chainId) && unref(name)),
    ),
    suspense,
    onError,
    onSettled,
    onSuccess,
  })
}
