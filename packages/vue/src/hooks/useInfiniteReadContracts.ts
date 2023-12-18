'use client'

import type {
  Config,
  ReadContractsErrorType,
  ResolvedRegister,
} from '@wagmi/core'
import {
  type InfiniteReadContractsQueryFnData,
  type InfiniteReadContractsQueryKey,
  infiniteReadContractsQueryOptions,
} from '@wagmi/core/query'
import type { ContractFunctionParameters } from 'viem'

import { computed } from 'vue-demi'
import type {
  InfiniteReadContractsData,
  InfiniteReadContractsOptions,
} from '../exports/query.js'
import type {
  ConfigParameter,
  DeepUnwrapRef,
  InfiniteQueryParameter,
  MaybeRefDeep,
} from '../types.js'
import { cloneDeepUnref } from '../utils/cloneDeepUnref.js'
import {
  type UseInfiniteQueryParameters,
  type UseInfiniteQueryReturnType,
  structuralSharing,
  useInfiniteQuery,
} from '../utils/query.js'
import { useChainId } from './useChainId.js'
import { useConfig } from './useConfig.js'

export type UseInfiniteContractReadsParameters<
  contracts extends readonly unknown[] = readonly ContractFunctionParameters[],
  allowFailure extends boolean = true,
  config extends Config = Config,
  pageParam = unknown,
  selectData = InfiniteReadContractsData<contracts, allowFailure>,
> = MaybeRefDeep<
  InfiniteReadContractsOptions<contracts, allowFailure, pageParam, config> &
    ConfigParameter<config> &
    InfiniteQueryParameter<
      InfiniteReadContractsQueryFnData<contracts, allowFailure>,
      ReadContractsErrorType,
      selectData,
      InfiniteReadContractsData<contracts, allowFailure>,
      InfiniteReadContractsQueryKey<contracts, allowFailure, pageParam, config>,
      pageParam
    >
>

export type UseInfiniteContractReadsReturnType<
  contracts extends readonly unknown[] = readonly ContractFunctionParameters[],
  allowFailure extends boolean = true,
  selectData = InfiniteReadContractsData<contracts, allowFailure>,
> = UseInfiniteQueryReturnType<selectData, ReadContractsErrorType>

/** https://beta.wagmi.sh/react/api/hooks/useInfiniteReadContracts */
export function useInfiniteReadContracts<
  const contracts extends readonly unknown[],
  allowFailure extends boolean = true,
  config extends Config = ResolvedRegister['config'],
  pageParam = unknown,
  selectData = InfiniteReadContractsData<contracts, allowFailure>,
>(
  parameters: UseInfiniteContractReadsParameters<
    contracts,
    allowFailure,
    config,
    pageParam,
    selectData
  >,
): UseInfiniteContractReadsReturnType<contracts, allowFailure, selectData> {
  const config = useConfig(parameters)
  const chainId = useChainId()

  const infiniteQueryOptions = computed(() => {
    const _parameters = cloneDeepUnref<
      DeepUnwrapRef<
        UseInfiniteContractReadsParameters<
          contracts,
          allowFailure,
          config,
          pageParam,
          selectData
        >
      >
    >(parameters as any)

    const { contracts = [], query } = _parameters

    const options = infiniteReadContractsQueryOptions(config, {
      ..._parameters,
      chainId: chainId.value,
      contracts:
        contracts as DeepUnwrapRef<UseInfiniteContractReadsParameters>['contracts'],
      query: query as UseInfiniteQueryParameters,
    })

    return {
      ...query,
      ...options,
      initialPageParam: options.initialPageParam,
      structuralSharing: query.structuralSharing ?? structuralSharing,
    }
  })

  return useInfiniteQuery(
    infiniteQueryOptions as any,
  ) as UseInfiniteContractReadsReturnType<contracts, allowFailure, selectData>
}
