import {
  type Config,
  type ReadContractErrorType,
  type ResolvedRegister,
} from '@wagmi/core'
import { type UnionEvaluate } from '@wagmi/core/internal'
import {
  type ReadContractData,
  type ReadContractOptions,
  type ReadContractQueryFnData,
  type ReadContractQueryKey,
  readContractQueryOptions,
} from '@wagmi/core/query'
import {
  type Abi,
  type ContractFunctionArgs,
  type ContractFunctionName,
} from 'viem'

import { computed } from 'vue-demi'
import type {
  ConfigParameter,
  DeepUnwrapRef,
  MaybeRefDeep,
  QueryParameter,
} from '../types.js'
import { cloneDeepUnref } from '../utils/cloneDeepUnref.js'
import {
  type UseQueryReturnType,
  structuralSharing,
  useQuery,
} from '../utils/query.js'
import { useChainId } from './useChainId.js'
import { useConfig } from './useConfig.js'

export type UseReadContractParameters<
  abi extends Abi | readonly unknown[] = Abi,
  functionName extends ContractFunctionName<
    abi,
    'pure' | 'view'
  > = ContractFunctionName<abi, 'pure' | 'view'>,
  args extends ContractFunctionArgs<
    abi,
    'pure' | 'view',
    functionName
  > = ContractFunctionArgs<abi, 'pure' | 'view', functionName>,
  config extends Config = Config,
  selectData = ReadContractData<abi, functionName, args>,
> = MaybeRefDeep<
  UnionEvaluate<
    ReadContractOptions<abi, functionName, args, config> &
      ConfigParameter<config> &
      QueryParameter<
        ReadContractQueryFnData<abi, functionName, args>,
        ReadContractErrorType,
        selectData,
        ReadContractQueryKey<abi, functionName, args, config>
      >
  >
>

export type UseReadContractReturnType<
  abi extends Abi | readonly unknown[] = Abi,
  functionName extends ContractFunctionName<
    abi,
    'pure' | 'view'
  > = ContractFunctionName<abi, 'pure' | 'view'>,
  args extends ContractFunctionArgs<
    abi,
    'pure' | 'view',
    functionName
  > = ContractFunctionArgs<abi, 'pure' | 'view', functionName>,
  selectData = ReadContractData<abi, functionName, args>,
> = UseQueryReturnType<selectData, ReadContractErrorType>

/** https://wagmi.sh/react/api/hooks/useReadContract */
export function useReadContract<
  const abi extends Abi | readonly unknown[],
  functionName extends ContractFunctionName<abi, 'pure' | 'view'>,
  args extends ContractFunctionArgs<abi, 'pure' | 'view', functionName>,
  config extends Config = ResolvedRegister['config'],
  selectData = ReadContractData<abi, functionName, args>,
>(
  parameters: UseReadContractParameters<
    abi,
    functionName,
    args,
    config,
    selectData
  > = {} as any,
): UseReadContractReturnType<abi, functionName, args, selectData> {
  const config = useConfig(parameters)
  const chainId = useChainId()

  const queryOptions = computed(() => {
    const _parameters = cloneDeepUnref<
      DeepUnwrapRef<
        UseReadContractParameters<abi, functionName, args, config, selectData>
      >
    >(parameters as any)

    const { abi, address, functionName, query = {} } = _parameters

    const options = readContractQueryOptions<config, abi, functionName, args>(
      config,
      {
        ...(_parameters as any),
        chainId: _parameters.chainId ?? chainId.value,
      },
    )
    const enabled = Boolean(
      address && abi && functionName && (query.enabled ?? true),
    )

    return {
      ...query,
      ...options,
      enabled,
      structuralSharing: query.structuralSharing ?? structuralSharing,
    }
  })

  return useQuery(queryOptions as any) as UseReadContractReturnType<
    abi,
    functionName,
    args,
    selectData
  >
}
