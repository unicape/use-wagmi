import { deepEqual, readContracts } from '@wagmi/core'
import type { ReadContractsConfig, ReadContractsResult } from '@wagmi/core'
import type { Contract, ContractsConfig } from '@wagmi/core/internal'
import type { Abi } from 'abitype'
import { computed, unref } from 'vue-demi'
import type { UnwrapRef } from 'vue-demi'
import { replaceEqualDeep } from 'vue-query'

import type {
  DeepMaybeRef,
  InfiniteQueryConfig,
  MaybeRef,
  QueryFunctionArgs,
} from '../../types'
import { useInfiniteQuery } from '../utils'

import type { UseInfiniteQueryResult } from '../utils'

export type UseContractInfiniteReadsConfig<
  TContracts extends Contract[] = Contract[],
  TPageParam = unknown,
  TSelectData = ReadContractsResult<TContracts>,
> = DeepMaybeRef<
  Pick<ReadContractsConfig<TContracts>, 'allowFailure' | 'overrides'>
> & {
  cacheKey: MaybeRef<string>
  contracts(pageParam: DeepMaybeRef<TPageParam>): readonly [
    ...ContractsConfig<
      TContracts,
      {
        /** Chain id to use for provider */
        chainId?: number
      }
    >,
  ]
} & InfiniteQueryConfig<ReadContractsResult<TContracts>, Error, TSelectData>

type QueryKeyArgs = {
  allowFailure: UseContractInfiniteReadsConfig['allowFailure']
  cacheKey: UseContractInfiniteReadsConfig['cacheKey']
  overrides: UseContractInfiniteReadsConfig['overrides']
}
type QueryKeyConfig = Pick<UseContractInfiniteReadsConfig, 'scopeKey'>

function queryKey({
  allowFailure,
  cacheKey,
  overrides,
  scopeKey,
}: QueryKeyArgs & QueryKeyConfig) {
  return [
    {
      entity: 'readContractsInfinite',
      allowFailure,
      cacheKey,
      overrides,
      scopeKey,
    },
  ] as const
}

function queryFn<
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends string,
  TContracts extends {
    abi: TAbi
    functionName: TFunctionName
  }[],
  TPageParam = unknown,
>({
  contracts,
}: {
  contracts: UseContractInfiniteReadsConfig<TContracts, TPageParam>['contracts']
}) {
  return ({
    queryKey: [{ allowFailure, overrides }],
    pageParam,
  }: UnwrapRef<QueryFunctionArgs<typeof queryKey>>) => {
    return readContracts({
      allowFailure,
      contracts: contracts(pageParam || undefined),
      // @ts-ignore
      overrides,
    })
  }
}

export function useContractInfiniteReads<
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends string,
  TContracts extends {
    abi: TAbi
    functionName: TFunctionName
  }[],
  TPageParam = any,
  TSelectData = ReadContractsResult<TContracts>,
>({
  allowFailure,
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
  overrides,
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
  TPageParam,
  TSelectData
>): UseInfiniteQueryResult<TSelectData, Error> {
  const queryKey_ = computed(() =>
    queryKey({
      allowFailure,
      cacheKey,
      overrides,
      scopeKey,
    }),
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
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends string,
  TContracts extends {
    abi: TAbi
    functionName: TFunctionName
  }[],
  TSelectData = ReadContractsResult<TContracts>,
>(
  fn: UseContractInfiniteReadsConfig<TContracts>['contracts'],
  {
    perPage,
    start,
    direction,
  }: {
    perPage: MaybeRef<number>
    start: MaybeRef<number>
    direction: MaybeRef<'increment' | 'decrement'>
  },
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
