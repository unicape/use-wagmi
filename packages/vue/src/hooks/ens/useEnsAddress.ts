import { fetchEnsAddress } from '@wagmi/core'

import type { FetchEnsAddressArgs, FetchEnsAddressResult } from '@wagmi/core'
import type { UnwrapRef } from 'vue-demi'
import { computed, unref } from 'vue-demi'

import type { DeepMaybeRef, QueryConfig, QueryFunctionArgs } from '../../types'
import { useChainId, useQuery } from '../utils'

export type UseEnsAddressArgs = DeepMaybeRef<Partial<FetchEnsAddressArgs>>
export type UseEnsAddressConfig = QueryConfig<FetchEnsAddressResult, Error>

type QueryKeyArgs = UseEnsAddressArgs
type QueryKeyConfig = Pick<UseEnsAddressConfig, 'scopeKey'>

function queryKey({ chainId, name, scopeKey }: QueryKeyArgs & QueryKeyConfig) {
  return [{ entity: 'ensAddress', chainId, name, scopeKey }] as const
}

function queryFn({
  queryKey: [{ chainId, name }],
}: UnwrapRef<QueryFunctionArgs<typeof queryKey>>) {
  if (!name) throw new Error('name is required')
  return fetchEnsAddress({ chainId, name })
}

export function useEnsAddress({
  cacheTime,
  chainId: chainId_,
  enabled = true,
  name,
  scopeKey,
  staleTime = 1_000 * 60 * 60 * 24, // 24 hours
  suspense,
  onError,
  onSettled,
  onSuccess,
}: UseEnsAddressArgs & UseEnsAddressConfig = {}) {
  const chainId = useChainId({ chainId: chainId_ })

  return useQuery(queryKey({ chainId, name, scopeKey }), queryFn, {
    cacheTime,
    enabled: computed(
      () => !!(unref(enabled) && unref(chainId) && unref(name)),
    ),
    staleTime,
    suspense,
    onError,
    onSettled,
    onSuccess,
  })
}
