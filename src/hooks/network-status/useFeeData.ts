import { unref, computed } from 'vue-demi'
import { fetchFeeData } from '@wagmi/core'
import { useChainId, useQuery, useInvalidateOnBlock } from '../utils'

import type { UnwrapRef } from 'vue-demi'
import type { FetchFeeDataArgs, FetchFeeDataResult } from '@wagmi/core'
import type { DeepMaybeRef, QueryConfig, QueryFunctionArgs } from '../../types'

export type UseFeeDataArgs = DeepMaybeRef<Partial<FetchFeeDataArgs> & {
  /** Subscribe to changes */
  watch?: boolean
}>
export type UseFeedDataConfig = QueryConfig<FetchFeeDataResult, Error>

type QueryKeyArgs = UseFeeDataArgs
type QueryKeyConfig = Pick<UseFeedDataConfig, 'scopeKey'>

function queryKey ({
  chainId,
  formatUnits,
  scopeKey,
}: QueryKeyArgs & QueryKeyConfig) {
  return [{ entity: 'feeData', chainId, formatUnits, scopeKey }] as const
}

function queryFn ({
  queryKey: [{ chainId, formatUnits }],
}: UnwrapRef<QueryFunctionArgs<typeof queryKey>>) {
  return fetchFeeData({ chainId, formatUnits })
}

export function useFeeData ({
  cacheTime,
  chainId: chainId_,
  enabled = true,
  formatUnits = 'wei',
  scopeKey,
  staleTime,
  suspense,
  watch,
  onError,
  onSettled,
  onSuccess,
}: UseFeeDataArgs & UseFeedDataConfig = {}) {
  const chainId = useChainId({ chainId: chainId_ })
  const queryKey_ = computed(() => queryKey({
    chainId,
    formatUnits,
    scopeKey
  })) as any

  const feeDataQuery = useQuery(queryKey_, queryFn, {
    cacheTime,
    enabled,
    staleTime,
    suspense,
    onError,
    onSettled,
    onSuccess,
  })

  useInvalidateOnBlock({
    chainId,
    enabled: computed(() => !!(unref(enabled) && unref(watch))),
    queryKey: queryKey_,
  })

  return feeDataQuery
}