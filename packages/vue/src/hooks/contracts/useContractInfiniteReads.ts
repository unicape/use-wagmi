import { replaceEqualDeep } from '@tanstack/vue-query'
import { deepEqual, readContracts } from '@wagmi/core'
import type { ReadContractsConfig, ReadContractsResult } from '@wagmi/core'
import type { Narrow } from 'abitype'
import type { ContractFunctionConfig, MulticallContracts } from 'viem'
import { computed, unref } from 'vue-demi'
import type { UnwrapRef } from 'vue-demi'

import type {
  DeepMaybeRef,
  InfiniteQueryConfig,
  MaybeRef,
  QueryFunctionArgs,
} from '../../types'
import { useInfiniteQuery } from '../utils'

import type { UseInfiniteQueryResult } from '../utils'

export type UseContractInfiniteReadsConfig<
  TContracts extends ContractFunctionConfig[] = ContractFunctionConfig[],
  TAllowFailure extends boolean = true,
  TPageParam = unknown,
  TSelectData = ReadContractsResult<TContracts, TAllowFailure>,
> = DeepMaybeRef<Pick<ReadContractsConfig<TContracts>, 'allowFailure'>> & {
  cacheKey: MaybeRef<string>
  contracts(pageParam: TPageParam): /** Contracts to query */
  Narrow<
    readonly [
      ...MulticallContracts<
        TContracts,
        {
          /** Chain id to use for Public Client. */
          chainId?: number
        }
      >,
    ]
  >
} & InfiniteQueryConfig<ReadContractsResult<TContracts>, Error, TSelectData> &
  (
    | {
        /** Block number to read against. */
        blockNumber?: ReadContractsConfig<TContracts>['blockNumber']
        blockTag?: never
        watch?: never
      }
    | {
        blockNumber?: never
        /** Block tag to read against. */
        blockTag?: ReadContractsConfig<TContracts>['blockTag']
        watch?: never
      }
    | {
        blockNumber?: never
        blockTag?: never
        /** Refresh on incoming blocks. */
        watch?: boolean
      }
  )

type QueryKeyArgs<TAllowFailure extends boolean = true> = {
  allowFailure: UseContractInfiniteReadsConfig<
    ContractFunctionConfig[],
    TAllowFailure
  >['allowFailure']
  cacheKey: UseContractInfiniteReadsConfig['cacheKey']
  blockNumber: UseContractInfiniteReadsConfig['blockNumber']
  blockTag: UseContractInfiniteReadsConfig['blockTag']
}
type QueryKeyConfig = Pick<UseContractInfiniteReadsConfig, 'scopeKey'>

function queryKey<TAllowFailure extends boolean = true>({
  allowFailure,
  blockNumber,
  blockTag,
  cacheKey,
  scopeKey,
}: QueryKeyArgs<TAllowFailure> & QueryKeyConfig) {
  return [
    {
      entity: 'readContractsInfinite',
      allowFailure,
      blockNumber,
      blockTag,
      cacheKey,
      scopeKey,
    },
  ] as const
}

function queryFn<
  TContracts extends ContractFunctionConfig[],
  TAllowFailure extends boolean = true,
  TPageParam = unknown,
>({
  contracts,
}: {
  contracts: UseContractInfiniteReadsConfig<
    TContracts,
    TAllowFailure,
    TPageParam
  >['contracts']
}) {
  return ({
    queryKey: [{ allowFailure, blockNumber, blockTag }],
    pageParam,
  }: UnwrapRef<QueryFunctionArgs<typeof queryKey>>) => {
    return readContracts({
      allowFailure,
      blockNumber,
      blockTag,
      contracts: contracts(pageParam || undefined),
    })
  }
}

export function useContractInfiniteReads<
  TContracts extends ContractFunctionConfig[],
  TAllowFailure extends boolean = true,
  TPageParam = any,
  TSelectData = ReadContractsResult<TContracts, TAllowFailure>,
>({
  allowFailure,
  blockNumber,
  blockTag,
  cacheKey,
  cacheTime,
  contracts,
  enabled: enabled_ = true,
  getNextPageParam,
  isDataEqual,
  keepPreviousData,
  onError,
  onSettled,
  onSuccess,
  scopeKey,
  select,
  staleTime,
  structuralSharing = (oldData, newData) =>
    deepEqual(oldData, newData)
      ? oldData
      : (replaceEqualDeep(oldData, newData) as any),
  suspense,
}: UseContractInfiniteReadsConfig<
  TContracts,
  TAllowFailure,
  TPageParam,
  TSelectData
>): // Need explicit type annotation so TypeScript doesn't expand return type into recursive conditional
UseInfiniteQueryResult<TSelectData, Error> {
  const queryKey_ = computed(() =>
    queryKey({ allowFailure, blockNumber, blockTag, cacheKey, scopeKey }),
  ) as any

  const enabled = computed(() => Boolean(unref(enabled_) && contracts))

  return useInfiniteQuery(queryKey_, queryFn({ contracts }), {
    cacheTime,
    enabled,
    getNextPageParam,
    isDataEqual,
    keepPreviousData,
    select,
    staleTime,
    structuralSharing,
    suspense,
    onError,
    onSettled,
    onSuccess,
  })
}

// TODO: Fix return type inference for `useContractInfiniteReads` when using `paginatedIndexesConfig`
export function paginatedIndexesConfig<
  TContracts extends ContractFunctionConfig[],
  TSelectData = ReadContractsResult<TContracts>,
>(
  fn: UseContractInfiniteReadsConfig<TContracts>['contracts'],
  {
    perPage,
    start,
    direction,
  }: DeepMaybeRef<{
    perPage: number
    start: number
    direction: 'increment' | 'decrement'
  }>,
): // Need explicit type annotation so TypeScript doesn't expand return type into recursive conditional
{
  contracts: UseContractInfiniteReadsConfig<TContracts>['contracts']
  getNextPageParam: InfiniteQueryConfig<
    unknown[],
    Error,
    TSelectData
  >['getNextPageParam']
} {
  const contracts = ((page = 0) =>
    [...Array(perPage).keys()]
      .map((index) => {
        return unref(direction) === 'increment'
          ? unref(start) + index + page * unref(perPage)
          : unref(start) - index - page * unref(perPage)
      })
      .filter((index) => index >= 0)
      .map(fn)
      .flat()) as unknown as typeof fn

  return {
    contracts,
    getNextPageParam(lastPage: unknown[], pages: unknown[]) {
      return lastPage?.length === unref(perPage) ? pages.length : undefined
    },
  }
}
