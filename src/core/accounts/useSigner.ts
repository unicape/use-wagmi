import { unref, getCurrentScope, onScopeDispose } from 'vue-demi'
import { fetchSigner, watchSigner } from '@wagmi/core'
import { useAccount } from './useAccount'
import { useChainId, useQuery, useQueryClient } from '../../utils'

import type { Signer, FetchSignerResult, FetchSignerArgs } from '@wagmi/core'
import type { QueryConfig, QueryFunctionArgs, DeepMaybeRef } from './../../types'

export type UseSignerArgs = DeepMaybeRef<FetchSignerArgs>
export type UseSignerConfig = Omit<
  QueryConfig<FetchSignerResult, Error>,
  'cacheTime' | 'staleTime' | 'enabled'
>

export function queryKey({ chainId }: UseSignerArgs) {
  return [{ entity: 'signer', chainId, persist: false }] as const
}

function queryFn<TSigner extends Signer>({
  queryKey: [{ chainId }],
}: QueryFunctionArgs<typeof queryKey>) {
  return fetchSigner<TSigner>({ chainId } as FetchSignerArgs)
}

export function useSigner<TSigner extends Signer> ({
  chainId: chainId_,
  suspense,
  onError,
  onSettled,
  onSuccess
}: UseSignerArgs & UseSignerConfig = {}) {
  const { connector } = useAccount()
  const chainId = useChainId()
  const signerQuery = useQuery<
    FetchSignerResult<TSigner>,
    Error,
    FetchSignerResult<TSigner>,
    ReturnType<typeof queryKey>
  >(
    queryKey({ chainId: chainId_ }),
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
    if (signer) queryClient.invalidateQueries(queryKey({ chainId }))
    // If there is no longer a signer (disconnect), we want to remove the query.
    else queryClient.removeQueries(queryKey({ chainId }))
  })

  if (getCurrentScope())
    onScopeDispose(() => unwatch())

  return signerQuery
}