import { unref, computed } from 'vue-demi'
import { fetchBalance } from '@wagmi/core'
import { useChainId, useQuery } from '../..//utils'

import type { FetchBalanceArgs, FetchBalanceResult } from '@wagmi/core'
import type { QueryConfig, QueryFunctionArgs, SetMaybeRef } from './../../types'

export type UseBalanceArgs = Partial<FetchBalanceArgs> & {
  /** Subscribe to changes */
  watch?: boolean
}

export type UseBalanceConfig = QueryConfig<FetchBalanceResult, Error>

type QueryKeyArgs = Partial<FetchBalanceArgs>
type QueryKeyConfig = Pick<UseBalanceConfig, 'scopeKey'>

function queryKey ({
  address,
  chainId,
  formatUnits,
  scopeKey,
  token
}: QueryKeyArgs & QueryKeyConfig) {
  return [{
    entity: 'balance',
    address,
    chainId,
    formatUnits,
    scopeKey,
    token
  }] as const
}

function queryFn ({
  queryKey: [{ address, chainId, formatUnits, token }],
}: QueryFunctionArgs<typeof queryKey>) {
  if (!address) throw new Error('address is required')
  return fetchBalance({ address, chainId, formatUnits, token })
}

export function useBalance ({
  address,
  cacheTime,
  chainId: chainId_,
  enabled = true,
  formatUnits,
  scopeKey,
  staleTime,
  suspense,
  token,
  watch,
  onError,
  onSettled,
  onSuccess
}: SetMaybeRef<UseBalanceArgs> & UseBalanceConfig = {}) {
  const chainId = useChainId({ chainId: chainId_ })
  const queryKey_ = computed(() => queryKey({
    address: unref(address),
    chainId: unref(chainId),
    formatUnits: unref(formatUnits),
    scopeKey: unref(scopeKey),
    token: unref(token)
  }))

  const balanceQuery = useQuery(
    unref(queryKey_),
    queryFn,
    {
      cacheTime: unref(cacheTime),
      enabled: Boolean(unref(enabled) && unref(address)),
      staleTime: unref(staleTime),
      suspense: unref(suspense),
      onError,
      onSettled,
      onSuccess
    }
  )

  return balanceQuery
}