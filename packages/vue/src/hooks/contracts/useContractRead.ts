import { replaceEqualDeep } from '@tanstack/vue-query'
import { deepEqual, readContract } from '@wagmi/core'

import type { ReadContractConfig, ReadContractResult } from '@wagmi/core'
import type { Abi } from 'abitype'
import type { UnwrapRef } from 'vue-demi'
import { computed, unref } from 'vue-demi'

import type {
  DeepMaybeRef,
  QueryConfigWithSelect,
  QueryFunctionArgs,
  ShallowMaybeRef,
} from '../../types'
import { useBlockNumber } from '../network-status'
import { useChainId, useInvalidateOnBlock, useQuery } from '../utils'

export type UseContractReadConfig<
  TAbi extends Abi | readonly unknown[] = Abi,
  TFunctionName extends string = string,
  TSelectData = ReadContractResult<TAbi, TFunctionName>,
> = DeepMaybeRef<ReadContractConfig<TAbi, TFunctionName>> &
  QueryConfigWithSelect<
    ReadContractResult<TAbi, TFunctionName>,
    Error,
    TSelectData
  > &
  ShallowMaybeRef<
    {
      /** If set to `true`, the cache will depend on the block number */
      cacheOnBlock?: boolean
    } & (
      | {
          /** Block number to read against. */
          blockNumber?: ReadContractConfig['blockNumber']
          blockTag?: never
          watch?: never
        }
      | {
          blockNumber?: never
          /** Block tag to read against. */
          blockTag?: ReadContractConfig['blockTag']
          watch?: never
        }
      | {
          blockNumber?: never
          blockTag?: never
          /** Refresh on incoming blocks. */
          watch?: boolean
        }
    )
  >

type QueryKeyArgs = ShallowMaybeRef<Omit<ReadContractConfig, 'abi'>>
type QueryKeyConfig = Pick<UseContractReadConfig, 'scopeKey'> &
  ShallowMaybeRef<{
    blockNumber?: bigint
  }>

function queryKey({
  address,
  args,
  blockNumber,
  blockTag,
  chainId,
  functionName,
  scopeKey,
}: QueryKeyArgs & QueryKeyConfig) {
  return [
    {
      entity: 'readContract',
      address,
      args,
      blockNumber,
      blockTag,
      chainId,
      functionName,
      scopeKey,
    },
  ] as const
}

function queryFn<
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends string,
>({ abi }: { abi?: Abi | readonly unknown[] }) {
  return async ({
    queryKey: [{ address, args, blockNumber, blockTag, chainId, functionName }],
  }: UnwrapRef<QueryFunctionArgs<typeof queryKey>>) => {
    if (!abi) throw new Error('abi is required')
    if (!address) throw new Error('address is required')
    return ((await readContract({
      address,
      args,
      blockNumber,
      blockTag,
      chainId,
      // TODO: Remove cast and still support `Narrow<TAbi>`
      abi: abi as Abi,
      functionName,
    })) ?? null) as ReadContractResult<TAbi, TFunctionName>
  }
}

export function useContractRead<
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends string,
  TSelectData = ReadContractResult<TAbi, TFunctionName>,
>(
  {
    abi,
    address,
    args,
    blockNumber: blockNumberOverride,
    blockTag,
    cacheOnBlock = false,
    cacheTime,
    chainId: chainId_,
    enabled: enabled_ = true,
    functionName,
    isDataEqual,
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
    watch,
  }: UseContractReadConfig<TAbi, TFunctionName, TSelectData> = {} as any,
) {
  const chainId = useChainId({ chainId: chainId_ })
  const { data: blockNumber_ } = useBlockNumber({
    chainId,
    enabled: computed(() => unref(watch) || unref(cacheOnBlock)),
    scopeKey: computed(() =>
      unref(watch) || unref(cacheOnBlock) ? undefined : 'idle',
    ),
    watch,
  })

  const blockNumber = computed(
    () => unref(blockNumberOverride) ?? blockNumber_.value,
  )

  const queryKey_ = computed(() =>
    queryKey({
      address,
      args,
      blockNumber: computed(() =>
        unref(cacheOnBlock) ? blockNumber.value : undefined,
      ),
      blockTag,
      chainId,
      functionName,
      scopeKey,
    } as ShallowMaybeRef<Omit<ReadContractConfig, 'abi'>>),
  )

  const enabled = computed(() => {
    let enabled = Boolean(
      unref(enabled_) && unref(abi) && unref(address) && unref(functionName),
    )
    if (unref(cacheOnBlock))
      enabled = Boolean(unref(enabled) && unref(blockNumber))
    return enabled
  })

  useInvalidateOnBlock({
    chainId,
    enabled: computed(() =>
      Boolean(unref(enabled) && unref(watch) && !unref(cacheOnBlock)),
    ),
    queryKey: unref(queryKey_),
  })

  return useQuery(
    queryKey_,
    queryFn({
      // TODO: Remove cast and still support `Narrow<TAbi>`
      abi: unref(abi) as Abi,
    }),
    {
      cacheTime,
      enabled,
      isDataEqual,
      select,
      staleTime,
      structuralSharing,
      suspense,
      onError,
      onSettled,
      onSuccess,
    },
  )
}
