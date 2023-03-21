import { unref, computed } from 'vue-demi'
import { replaceEqualDeep } from 'vue-query'
import { deepEqual, parseContractResult, readContracts } from '@wagmi/core'
import { useChainId, useQuery, useInvalidateOnBlock } from '../../utils'
import { useBlockNumber } from '../network-status'

import type { Abi, Address } from 'abitype'
import type { UnwrapRef } from 'vue-demi'
import type { UseQueryReturnType } from 'vue-query'
import type { Contract } from '@wagmi/core/internal'
import type { ReadContractsConfig, ReadContractsResult } from '@wagmi/core'
import type { MaybeRef, DeepMaybeRef, DeepPartial, QueryConfig, QueryFunctionArgs } from '../../types'

export type UseContractReadsConfig<
  TContracts extends Contract[],
  TSelectData = ReadContractsResult<TContracts>,
  Config = DeepMaybeRef<ReadContractsConfig<TContracts>>
> = {
  [K in keyof Config]?: K extends 'contracts'
    ? DeepPartial<Config[K], 2>
    : Config[K]
} & QueryConfig<ReadContractsResult<TContracts>, Error, TSelectData> & {
    /** If set to `true`, the cache will depend on the block number */
    cacheOnBlock?: MaybeRef<boolean>
    /** Subscribe to changes */
    watch?: MaybeRef<boolean>
  }

type QueryKeyArgs<TContracts extends Contract[]> = DeepMaybeRef<ReadContractsConfig<TContracts>>
type QueryKeyConfig<TContracts extends Contract[]> = Pick<
  UseContractReadsConfig<TContracts>,
  'scopeKey'
> & {
  blockNumber?: MaybeRef<number>
  chainId?: MaybeRef<number>
}

type ContractConfig = {
  abi: Abi
  address: Address
  args: unknown[]
  chainId?: number
  functionName: string
}

function queryKey<
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends string,
  TContracts extends {
    abi: TAbi
    functionName: TFunctionName
  }[]
>({
  allowFailure,
  blockNumber,
  chainId,
  contracts,
  overrides,
  scopeKey
}: QueryKeyArgs<TContracts> & QueryKeyConfig<TContracts>) {
  return [{
    entity: 'readContracts',
    allowFailure,
    blockNumber,
    chainId,
    scopeKey,
    contracts: ((unref(contracts) ?? []) as unknown as ContractConfig[]).map(
      ({ address, args, chainId, functionName }) => ({
        address,
        args,
        chainId,
        functionName
      })
    ),
    overrides
  }] as const
}

function queryFn<
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends string,
  TContracts extends {
    abi: TAbi
    functionName: TFunctionName
  }[]
>({ abis }: { abis: (Abi | readonly unknown[])[] }) {
  return ({
    queryKey: [{ allowFailure, contracts: contracts_, overrides }]
  }: UnwrapRef<QueryFunctionArgs<typeof queryKey<TAbi, TFunctionName, TContracts>>>) => {
    const contracts = (contracts_ as unknown as ContractConfig[]).map(
      (contract, i) => ({
        ...contract,
        abi: abis[i] as Abi
      })
    )
    return readContracts({
      allowFailure,
      contracts,
      // @ts-ignore
      overrides
    }) as Promise<ReadContractsResult<TContracts>>
  }
}

export function useContractReads<
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends string,
  TContracts extends {
    abi: TAbi
    functionName: TFunctionName
  }[],
  TSelectData = ReadContractsResult<TContracts>
> ({
  allowFailure = true,
  cacheOnBlock = false,
  cacheTime,
  contracts,
  enabled: enabled_ = true,
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
  watch
}: UseContractReadsConfig<TContracts, TSelectData> = {} as any): UseQueryReturnType<TSelectData, Error> {
  const { data: blockNumber } = useBlockNumber({
    enabled: computed(() => unref(watch) && unref(cacheOnBlock)),
    watch
  })
  const chainId = useChainId()

  const queryKey_ = computed(() => queryKey({
    allowFailure,
    blockNumber: unref(cacheOnBlock) ? blockNumber : undefined,
    chainId,
    contracts,
    overrides,
    scopeKey
  } as QueryKeyArgs<TContracts> & QueryKeyConfig<TContracts>)) as any

  const enabled = computed(() => {
    let enabled = Boolean(unref(enabled_) && (unref(contracts) as unknown as ContractConfig[])?.every(
      x => x.abi && x.address && x.functionName
    ))
    if (unref(cacheOnBlock)) enabled = Boolean(unref(enabled) && unref(blockNumber))
    return enabled
  })

  useInvalidateOnBlock({
    enabled: Boolean(unref(enabled) && unref(watch) && !unref(cacheOnBlock)),
    queryKey: queryKey_,
  })

  const abis = ((unref(contracts) ?? []) as unknown as ContractConfig[]).map(
    ({ abi }) => abi,
  )

  return useQuery(
    queryKey_,
    queryFn({ abis: unref(abis) }),
    {
      cacheTime,
      enabled,
      isDataEqual,
      keepPreviousData,
      staleTime,
      select(data) {
        const result = data.map((data, i) => {
          const { abi, functionName } = ((unref(contracts) as unknown as ContractConfig[])?.[i] ?? {}) as ContractConfig
          return abi && functionName
            ? parseContractResult({ abi: unref(abi), functionName: unref(functionName), data })
            : data
        }) as ReadContractsResult<TContracts>
        return (select ? select(result) : result) as TSelectData
      },
      structuralSharing,
      suspense,
      onError,
      onSettled,
      onSuccess
    }
  ) as unknown as UseQueryReturnType<TSelectData, Error>
}