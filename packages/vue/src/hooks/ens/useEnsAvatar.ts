import { fetchEnsAvatar } from '@wagmi/core'
import type { FetchEnsAddressResult, FetchEnsAvatarArgs } from '@wagmi/core'
import type { UnwrapRef } from 'vue-demi'
import { computed, unref } from 'vue-demi'

import type {
  QueryConfig,
  QueryFunctionArgs,
  ShallowMaybeRef,
} from '../../types'
import { useChainId, useQuery } from '../utils'

export type UseEnsAvatarArgs = ShallowMaybeRef<
  Omit<Partial<FetchEnsAvatarArgs>, 'name'> & {
    name?: FetchEnsAvatarArgs['name'] | null
  }
>
export type UseEnsAvatarConfig = QueryConfig<FetchEnsAddressResult, Error>

type QueryKeyArgs = UseEnsAvatarArgs
type QueryKeyConfig = Pick<UseEnsAvatarConfig, 'scopeKey'>

function queryKey({ name, chainId, scopeKey }: QueryKeyArgs & QueryKeyConfig) {
  return [{ entity: 'ensAvatar', name, chainId, scopeKey }] as const
}

function queryFn({
  queryKey: [{ name, chainId }],
}: UnwrapRef<QueryFunctionArgs<typeof queryKey>>) {
  if (!name) throw new Error('name is required')
  return fetchEnsAvatar({ name, chainId })
}

export function useEnsAvatar({
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
}: UseEnsAvatarArgs & UseEnsAvatarConfig = {}) {
  const chainId = useChainId({ chainId: chainId_ })

  return useQuery(queryKey({ name, chainId, scopeKey }), queryFn, {
    cacheTime,
    enabled: computed(
      () => !!(unref(enabled) && unref(name) && unref(chainId)),
    ),
    staleTime,
    suspense,
    onError,
    onSettled,
    onSuccess,
  })
}
