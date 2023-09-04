import { replaceEqualDeep } from '@tanstack/vue-query'
import { deepEqual, readContracts } from '@wagmi/core'
import type { ReadContractsConfig, ReadContractsResult } from '@wagmi/core'
import type { Abi } from 'abitype'
import type { ContractFunctionConfig } from 'viem'
import { computed, unref } from 'vue-demi'
import type { UnwrapRef } from 'vue-demi'

import type {
  MaybeRef,
  DeepMaybeRef,
  DeepPartial,
  QueryConfigWithSelect,
  QueryFunctionArgs,
  ShallowMaybeRef,
} from '../../types'
import { useBlockNumber } from '../network-status'
import { useChainId, useInvalidateOnBlock, useQuery } from '../utils'

import type { UseQueryResult } from '../utils'

export type UseContractReadsConfig<
  TContracts extends ContractFunctionConfig[],
  TAllowFailure extends boolean = true,
  TSelectData = ReadContractsResult<TContracts, TAllowFailure>,
  Config = ReadContractsConfig<TContracts, TAllowFailure>,
> = {
  [K in keyof Config]?: K extends 'contracts'
  ? MaybeRef<DeepMaybeRef<DeepPartial<Config[K], 2>>>
  : MaybeRef<Config[K]>
} & QueryConfigWithSelect<
  ReadContractsResult<TContracts, TAllowFailure>,
  Error,
  TSelectData
> &
  ShallowMaybeRef<
    {
      /** If set to `true`, the cache will depend on the block number */
      cacheOnBlock?: boolean
      /** Set this to `true` to keep the previous data when fetching based on a new query key. Defaults to `false`. */
      keepPreviousData?: boolean
    } & (
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
  >

type QueryKeyArgs<
  TContracts extends ContractFunctionConfig[],
  TAllowFailure extends boolean = true,
> = ShallowMaybeRef<
  Omit<
    ReadContractsConfig<TContracts, TAllowFailure>,
    'blockNumber' | 'blockTag'
  > & {
    blockNumber?: bigint
    blockTag?: string
  }
>
type QueryKeyConfig<TContracts extends ContractFunctionConfig[]> = Pick<
  UseContractReadsConfig<TContracts>,
  'scopeKey'
> &
  ShallowMaybeRef<{
    chainId?: number
  }>

function queryKey<
  TContracts extends ContractFunctionConfig[],
  TAllowFailure extends boolean = true,
>({
  allowFailure,
  blockNumber,
  blockTag,
  chainId,
  contracts,
  scopeKey,
}: QueryKeyArgs<TContracts, TAllowFailure> & QueryKeyConfig<TContracts>) {
  return [
    {
      entity: 'readContracts',
      allowFailure,
      blockNumber,
      blockTag,
      chainId,
      scopeKey,
      contracts: (
        (contracts ?? []) as unknown as (ContractFunctionConfig & {
          chainId?: number
        })[]
      ).map(({ address, args, chainId, functionName }) => ({
        address,
        args,
        chainId,
        functionName,
      })),
    },
  ] as const
}

function queryFn<
  TContracts extends ContractFunctionConfig[],
  TAllowFailure extends boolean = true,
>({ abis }: { abis: (Abi | readonly unknown[])[] }) {
  return ({
    queryKey: [{ allowFailure, blockNumber, blockTag, contracts: contracts_ }],
  }: UnwrapRef<QueryFunctionArgs<typeof queryKey<TContracts>>>) => {
    const contracts = unref(contracts_).map((contract, i) => ({
      ...contract,
      abi: abis[i] as Abi,
    }))
    return readContracts({
      allowFailure,
      contracts,
      blockNumber,
      blockTag,
    } as ReadContractsConfig<TContracts, TAllowFailure>) as Promise<
      ReadContractsResult<TContracts, TAllowFailure>
    >
  }
}

export function useContractReads<
  TContracts extends ContractFunctionConfig[],
  TAllowFailure extends boolean = true,
  TSelectData = ReadContractsResult<TContracts, TAllowFailure>,
>(
  {
    allowFailure: allowFailure_,
    blockNumber: blockNumberOverride,
    blockTag,
    cacheOnBlock = false,
    cacheTime,
    contracts,
    enabled: enabled_ = true,
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
    watch,
  }: UseContractReadsConfig<TContracts, TAllowFailure, TSelectData> = {} as any,
  // Need explicit type annotation so TypeScript doesn't expand return type into recursive conditional
): UseQueryResult<TSelectData, Error> {
  const allowFailure = computed(() => unref(allowFailure_) ?? true)

  const { data: blockNumber_ } = useBlockNumber({
    enabled: computed(() => unref(watch) && unref(cacheOnBlock)),
    watch,
  })
  const chainId = useChainId()

  const blockNumber = computed(
    () => unref(blockNumberOverride) ?? blockNumber_.value,
  )

  const queryKey_ = computed(() =>
    queryKey({
      allowFailure,
      blockNumber: cacheOnBlock ? blockNumber : undefined,
      blockTag,
      chainId,
      contracts,
      scopeKey,
    } as unknown as QueryKeyArgs<TContracts> & QueryKeyConfig<TContracts>),
  )

  const enabled = computed(() => {
    let enabled = Boolean(
      unref(enabled_) &&
        (unref(contracts) as unknown as ContractFunctionConfig[])?.every(
          (x) => x.abi && x.address && x.functionName,
        ),
    )
    if (unref(cacheOnBlock))
      enabled = Boolean(unref(enabled) && unref(blockNumber))
    return enabled
  })

  useInvalidateOnBlock({
    enabled: Boolean(unref(enabled) && unref(watch) && !unref(cacheOnBlock)),
    queryKey: queryKey_.value,
  })

  const abis = (
    (unref(contracts) ?? []) as unknown as ContractFunctionConfig[]
  ).map(({ abi }) => abi)

  return useQuery(queryKey_, queryFn({ abis: unref(abis) }), {
    cacheTime,
    enabled,
    isDataEqual,
    keepPreviousData,
    staleTime,
    select,
    structuralSharing,
    suspense,
    onError,
    onSettled,
    onSuccess,
  })
}
