import { unref, computed } from 'vue-demi'
import { fetchEnsAvatar } from '@wagmi/core'
import { useChainId, useQuery } from '../utils'

import type { UnwrapRef } from 'vue-demi'
import type { FetchEnsAvatarArgs, FetchEnsAddressResult } from '@wagmi/core'
import type { DeepMaybeRef, QueryConfig, QueryFunctionArgs } from '../../types'

export type UseEnsAvatarArgs = DeepMaybeRef<Partial<FetchEnsAvatarArgs>>
export type UseEnsAvatarConfig = QueryConfig<FetchEnsAddressResult, Error>

type QueryKeyArgs = UseEnsAvatarArgs
type QueryKeyConfig = Pick<UseEnsAvatarConfig, 'scopeKey'>

function queryKey ({
  address,
  chainId,
  scopeKey
}: QueryKeyArgs & QueryKeyConfig) {
  return [{ entity: 'ensAvatar', address, chainId, scopeKey }] as const
}

function queryFn ({
  queryKey: [{ address, chainId }]
}: UnwrapRef<QueryFunctionArgs<typeof queryKey>>) {
  if (!address) throw new Error('address is required')
  return fetchEnsAvatar({ address, chainId })
}

export function useEnsAvatar ({
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
}: UseEnsAvatarArgs & UseEnsAvatarConfig = {}) {
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