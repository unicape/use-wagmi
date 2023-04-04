import { fetchSigner, watchSigner } from '@wagmi/core'
import type { FetchSignerArgs, FetchSignerResult, Signer } from '@wagmi/core'
import { computed, getCurrentScope, onScopeDispose, unref } from 'vue-demi'

import type { UnwrapRef } from 'vue-demi'

import type {
  DeepMaybeRef,
  QueryConfig,
  QueryFunctionArgs,
} from './../../types'
import { useAccount } from './useAccount'
import { useChainId, useQuery, useQueryClient } from '../utils'

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
}: UnwrapRef<QueryFunctionArgs<typeof queryKey>>) {
  return fetchSigner<TSigner>({ chainId })
}

export function useSigner<TSigner extends Signer>({
  chainId: chainId_,
  suspense,
  onError,
  onSettled,
  onSuccess,
}: UseSignerArgs & UseSignerConfig = {}) {
  const { connector } = useAccount()
  const chainId = useChainId()
  const signerQuery = useQuery<
    FetchSignerResult<TSigner>,
    Error,
    FetchSignerResult<TSigner>,
    ReturnType<typeof queryKey>
  >(queryKey({ chainId: chainId_ }), queryFn, {
    cacheTime: 0,
    enabled: computed(() => !!connector.value),
    staleTime: Infinity,
    suspense,
    onError,
    onSettled,
    onSuccess,
  })

  const queryClient = useQueryClient()
  const unwatch = watchSigner({ chainId: unref(chainId) }, (signer) => {
    // If a signer has changed (switch wallet/connector), we want to revalidate.
    if (signer) queryClient.invalidateQueries(queryKey({ chainId }))
    // If there is no longer a signer (disconnect), we want to remove the query.
    else queryClient.removeQueries(queryKey({ chainId }))
  })

  if (getCurrentScope()) onScopeDispose(() => unwatch())

  return signerQuery
}
