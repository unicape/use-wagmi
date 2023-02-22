import { fetchSigner } from '@wagmi/core'

import { FetchSignerArgs, FetchSignerResult, Signer } from '@wagmi/core'
import type { QueryConfig } from '../../../types'


export type UseSignerConfig = Omit<
  QueryConfig<FetchSignerResult, Error>,
  'cacheTime' | 'staleTime' | 'enabled'
> &
  FetchSignerArgs

export function queryKey ({ chainId }: FetchSignerArgs) {
  return [{ entity: 'signer', chainId, persist: false }] as const
}

function queryFn<TSigner extends Signer> ({
  queryKey: [{ chainId }]
}) {
  return fetchSigner<TSigner>({ chainId })
}

export function useSigner ({
  chainId: chainId_,
  suspense,
  onError,
  onSettled,
  onSuccess
}: UseSignerConfig = {}) {

}