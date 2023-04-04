import { unref, computed } from 'vue-demi'
import { fetchBalance } from '@wagmi/core'
import { useChainId, useQuery, useInvalidateOnBlock } from '../utils'

import type { UnwrapRef } from 'vue-demi'
import type { FetchBalanceArgs, FetchBalanceResult } from '@wagmi/core'
import type { QueryConfig, QueryFunctionArgs, DeepMaybeRef } from './../../types'

export type UseBalanceArgs = DeepMaybeRef<Partial<FetchBalanceArgs> & {
  /** Subscribe to changes */
  watch?: boolean
}>

export type UseBalanceConfig = QueryConfig<FetchBalanceResult, Error>

type QueryKeyArgs = DeepMaybeRef<Partial<FetchBalanceArgs>>
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
  queryKey: [{ address, chainId, formatUnits, token }]
}: UnwrapRef<QueryFunctionArgs<typeof queryKey>>) {
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
}: UseBalanceArgs & UseBalanceConfig = {}) {
  const chainId = useChainId({ chainId: chainId_ })
  const queryKey_ = computed(() => queryKey({
    address,
    chainId,
    formatUnits,
    scopeKey,
    token
  })) as any

  const balanceQuery = useQuery(
    queryKey_,
    queryFn,
    {
      cacheTime,
      enabled: computed(() => !!(unref(enabled) && unref(address))),
      staleTime,
      suspense,
      onError,
      onSettled,
      onSuccess
    }
  )

  useInvalidateOnBlock({
    chainId,
    enabled: computed(() => !!(unref(enabled) && unref(watch) && unref(address))),
    queryKey: queryKey_
  })

  return balanceQuery
}