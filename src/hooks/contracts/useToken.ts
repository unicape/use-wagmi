import { unref, computed } from 'vue-demi'
import { fetchToken } from '@wagmi/core'
import { useChainId, useQuery } from '../utils'

import type { UnwrapRef } from 'vue-demi'
import type { FetchTokenArgs, FetchTokenResult } from '@wagmi/core'
import type { MaybeRef, DeepMaybeRef, QueryConfig, QueryFunctionArgs } from '../../types'

export type UseTokenArgs = DeepMaybeRef<Partial<FetchTokenArgs>>
export type UseTokenConfig = QueryConfig<FetchTokenResult, Error>

type QueryKeyArgs = UseTokenArgs & {
  chainId?: MaybeRef<number>
}
type QueryKeyConfig = DeepMaybeRef<Pick<UseTokenConfig, 'scopeKey'> & {
  activeChainId?: number
  signerAddress?: string
}>

function queryKey ({
  address,
  chainId,
  formatUnits,
  scopeKey
}: QueryKeyArgs & QueryKeyConfig) {
  return [{ entity: 'token', address, chainId, formatUnits, scopeKey }] as const
}

function queryFn ({
  queryKey: [{ address, chainId, formatUnits }]
}: UnwrapRef<QueryFunctionArgs<typeof queryKey>>) {
  if (!address) throw new Error('address is required')
  return fetchToken({ address, chainId, formatUnits })
}

export function useToken ({
  address,
  chainId: chainId_,
  formatUnits = 'ether',
  cacheTime,
  enabled = true,
  scopeKey,
  staleTime = 1_000 * 60 * 60 * 24, // 24 hours
  suspense,
  onError,
  onSettled,
  onSuccess
}: UseTokenArgs & UseTokenConfig = {}) {
  const chainId = useChainId({ chainId: chainId_ })

  return useQuery(
    queryKey({ address, chainId, formatUnits, scopeKey }),
    queryFn,
    {
      cacheTime,
      enabled: computed(() => unref(enabled) && !!unref(address)),
      staleTime,
      suspense,
      onError,
      onSettled,
      onSuccess
    }
  )
}