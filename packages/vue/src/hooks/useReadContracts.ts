'use client'

import {
  type Config,
  type ReadContractsErrorType,
  type ResolvedRegister,
} from '@wagmi/core'
import { type Evaluate } from '@wagmi/core/internal'
import {
  type ReadContractsData,
  type ReadContractsOptions,
  type ReadContractsQueryFnData,
  type ReadContractsQueryKey,
  readContractsQueryOptions,
} from '@wagmi/core/query'
import { type ContractFunctionParameters } from 'viem'

import { computed } from 'vue-demi'
import {
  type ConfigParameter,
  type DeepUnwrapRef,
  type MaybeRefDeep,
  type QueryParameter,
} from '../types.js'
import { cloneDeepUnref } from '../utils/cloneDeepUnref.js'
import {
  type UseQueryReturnType,
  structuralSharing,
  useQuery,
} from '../utils/query.js'
import { useChainId } from './useChainId.js'
import { useConfig } from './useConfig.js'

export type UseReadContractsParameters<
  contracts extends readonly unknown[] = readonly ContractFunctionParameters[],
  allowFailure extends boolean = true,
  config extends Config = Config,
  selectData = ReadContractsData<contracts, allowFailure>,
> = MaybeRefDeep<
  Evaluate<
    ReadContractsOptions<contracts, allowFailure, config> &
      ConfigParameter<config> &
      QueryParameter<
        ReadContractsQueryFnData<contracts, allowFailure>,
        ReadContractsErrorType,
        selectData,
        ReadContractsQueryKey<contracts, allowFailure, config>
      >
  >
>

export type UseReadContractsReturnType<
  contracts extends readonly unknown[] = readonly ContractFunctionParameters[],
  allowFailure extends boolean = true,
  selectData = ReadContractsData<contracts, allowFailure>,
> = UseQueryReturnType<selectData, ReadContractsErrorType>

/** https://wagmi.sh/react/api/hooks/useReadContracts */
export function useReadContracts<
  const contracts extends readonly unknown[],
  allowFailure extends boolean = true,
  config extends Config = ResolvedRegister['config'],
  selectData = ReadContractsData<contracts, allowFailure>,
>(
  parameters: UseReadContractsParameters<
    contracts,
    allowFailure,
    config,
    selectData
  > = {},
): UseReadContractsReturnType<contracts, allowFailure, selectData> {
  const config = useConfig(parameters)
  const chainId = useChainId()

  const queryOptions = computed(() => {
    const _parameters = cloneDeepUnref<
      DeepUnwrapRef<
        UseReadContractsParameters<contracts, allowFailure, config, selectData>
      >
    >(parameters as any)

    const { contracts = [], query = {} } = _parameters
    const options = readContractsQueryOptions<config, contracts, allowFailure>(
      config,
      {
        ..._parameters,
        chainId: chainId.value,
      } as any,
    )

    let isContractsValid = false
    for (const contract of contracts as ContractFunctionParameters[]) {
      const { abi, address, functionName } = contract
      if (!abi || !address || !functionName) {
        isContractsValid = false
        break
      }
      isContractsValid = true
    }
    const enabled = Boolean(isContractsValid && (query.enabled ?? true))

    return {
      ...options,
      ...query,
      enabled,
      structuralSharing: query.structuralSharing ?? structuralSharing,
    }
  })

  return useQuery(queryOptions as any) as UseReadContractsReturnType<
    contracts,
    allowFailure,
    selectData
  >
}
