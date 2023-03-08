import { unref, getCurrentScope, onScopeDispose } from 'vue-demi'
import { fetchSigner, watchSigner } from '@wagmi/core'
import { useAccount } from './useAccount'
import { useChainId, useQuery, useQueryClient } from '../../utils'

import type { Signer, FetchSignerResult, FetchSignerArgs } from '@wagmi/core'
import type { QueryConfig, QueryFunctionArgs, SetMaybeRef } from './../../types'

export type UseSignerConfig = Omit<
  QueryConfig<FetchSignerResult, Error>,
  'cacheTime' | 'staleTime' | 'enabled'
> & SetMaybeRef<FetchSignerArgs>

export function queryKey({ chainId }: FetchSignerArgs) {
  return [{ entity: 'signer', chainId, persist: false }] as const
}

function queryFn<TSigner extends Signer>({
  queryKey: [{ chainId }],
}: QueryFunctionArgs<typeof queryKey>) {
  return fetchSigner<TSigner>({ chainId })
}

export function useSigner<TSigner extends Signer> ({
  chainId: chainId_,
  suspense,
  onError,
  onSettled,
  onSuccess
}: UseSignerConfig = {}) {
  const { connector } = useAccount()
  const chainId = useChainId()
  const signerQuery = useQuery<
    FetchSignerResult<TSigner>,
    Error,
    FetchSignerResult<TSigner>,
    ReturnType<typeof queryKey>
  >(
    queryKey({ chainId: unref(chainId_) }),
    queryFn,
    {
      cacheTime: 0,
      enabled: Boolean(connector),
      staleTime: Infinity,
      suspense,
      onError,
      onSettled,
      onSuccess,
    }
  )

  const queryClient = useQueryClient()
  const unwatch = watchSigner({ chainId: unref(chainId) }, signer => {
    // If a signer has changed (switch wallet/connector), we want to revalidate.
    if (signer) queryClient.invalidateQueries(queryKey({ chainId: unref(chainId) }))
    // If there is no longer a signer (disconnect), we want to remove the query.
    else queryClient.removeQueries(queryKey({ chainId: unref(chainId) }))
  })

  if (getCurrentScope())
    onScopeDispose(() => unwatch())

  return signerQuery
}