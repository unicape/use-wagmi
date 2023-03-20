import { unref, computed } from 'vue-demi'
import { waitForTransaction } from '@wagmi/core'
import { useChainId, useQuery } from '../../utils'

import type { WaitForTransactionArgs, WaitForTransactionResult } from '@wagmi/core'
import type { DeepMaybeRef, QueryConfig, QueryFunctionArgs } from '../../types'

export type UseWaitForTransactionArgs = DeepMaybeRef<Omit<Partial<WaitForTransactionArgs>, 'onSpeedUp'>> & Pick<Partial<WaitForTransactionArgs>, 'onSpeedUp'>
export type UseWaitForTransactionConfig = QueryConfig<WaitForTransactionResult, Error>

type QueryKeyArgs = UseWaitForTransactionArgs
type QueryKeyConfig = Pick<UseWaitForTransactionConfig, 'scopeKey'>

function queryKey ({
  confirmations,
  chainId,
  hash,
  scopeKey,
  timeout
}: QueryKeyArgs & QueryKeyConfig) {
  return [{
    entity: 'waitForTransaction',
    confirmations,
    chainId,
    hash,
    scopeKey,
    timeout
  }] as const
}

function queryFn ({
  onSpeedUp
}: {
  onSpeedUp?: WaitForTransactionArgs['onSpeedUp']
}) {
  return ({
    queryKey: [{ chainId, confirmations, hash: hash_, timeout }]
  }: QueryFunctionArgs<typeof queryKey>) => {
    const hash = unref(hash_)
    if (!hash) throw new Error('hash is required')
    return waitForTransaction({
      chainId: unref(chainId),
      confirmations: unref(confirmations),
      hash,
      onSpeedUp,
      timeout: unref(timeout)
    })
  }
}

export function useWaitTranscation ({
  chainId: chainId_,
  confirmations,
  hash,
  timeout,
  cacheTime,
  enabled = true,
  scopeKey,
  staleTime,
  suspense,
  onError,
  onSpeedUp,
  onSettled,
  onSuccess
}: UseWaitForTransactionArgs & UseWaitForTransactionConfig = {}) {
  const chainId = useChainId({ chainId: chainId_ })

  return useQuery(
    queryKey({ chainId, confirmations, hash, scopeKey, timeout }),
    queryFn({ onSpeedUp }),
    {
      cacheTime,
      enabled: computed(() => !!(unref(enabled) && unref(hash))),
      staleTime,
      suspense,
      onError,
      onSettled,
      onSuccess
    }
  )
}