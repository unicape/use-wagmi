'use client'

import type {
  Config,
  ResolvedRegister,
  SimulateContractErrorType,
} from '@wagmi/core'
import {
  type SimulateContractData,
  type SimulateContractOptions,
  type SimulateContractQueryFnData,
  type SimulateContractQueryKey,
  simulateContractQueryOptions,
} from '@wagmi/core/query'
import type { Abi, ContractFunctionArgs, ContractFunctionName } from 'viem'

import { computed, unref } from 'vue-demi'
import type {
  ConfigParameter,
  DeepUnwrapRef,
  MaybeRefDeep,
  QueryParameter,
} from '../types.js'
import { cloneDeepUnref } from '../utils/cloneDeepUnref.js'
import { type UseQueryReturnType, useQuery } from '../utils/query.js'
import { useChainId } from './useChainId.js'
import { useConfig } from './useConfig.js'
import { useConnectorClient } from './useConnectorClient.js'

export type UseSimulateContractParameters<
  abi extends Abi | readonly unknown[] = Abi,
  functionName extends ContractFunctionName<
    abi,
    'nonpayable' | 'payable'
  > = ContractFunctionName<abi, 'nonpayable' | 'payable'>,
  args extends ContractFunctionArgs<
    abi,
    'nonpayable' | 'payable',
    functionName
  > = ContractFunctionArgs<abi, 'nonpayable' | 'payable', functionName>,
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] | undefined = undefined,
  selectData = SimulateContractData<abi, functionName, args, config, chainId>,
> = MaybeRefDeep<
  SimulateContractOptions<abi, functionName, args, config, chainId> &
    ConfigParameter<config> &
    QueryParameter<
      SimulateContractQueryFnData<abi, functionName, args, config, chainId>,
      SimulateContractErrorType,
      selectData,
      SimulateContractQueryKey<abi, functionName, args, config, chainId>
    >
>

export type UseSimulateContractReturnType<
  abi extends Abi | readonly unknown[] = Abi,
  functionName extends ContractFunctionName<
    abi,
    'nonpayable' | 'payable'
  > = ContractFunctionName<abi, 'nonpayable' | 'payable'>,
  args extends ContractFunctionArgs<
    abi,
    'nonpayable' | 'payable',
    functionName
  > = ContractFunctionArgs<abi, 'nonpayable' | 'payable', functionName>,
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] | undefined = undefined,
  selectData = SimulateContractData<abi, functionName, args, config, chainId>,
> = UseQueryReturnType<selectData, SimulateContractErrorType>

/** https://rc.wagmi.sh/react/api/hooks/useSimulateContract */
export function useSimulateContract<
  const abi extends Abi | readonly unknown[],
  functionName extends ContractFunctionName<abi, 'nonpayable' | 'payable'>,
  args extends ContractFunctionArgs<
    abi,
    'nonpayable' | 'payable',
    functionName
  >,
  config extends Config = ResolvedRegister['config'],
  chainId extends config['chains'][number]['id'] | undefined = undefined,
  selectData = SimulateContractData<abi, functionName, args, config, chainId>,
>(
  parameters: UseSimulateContractParameters<
    abi,
    functionName,
    args,
    config,
    chainId,
    selectData
  > = {} as any,
): UseSimulateContractReturnType<
  abi,
  functionName,
  args,
  config,
  chainId,
  selectData
> {
  const config = useConfig(parameters)
  const { data: connectorClient } = useConnectorClient({
    connector: computed(() => unref(unref(parameters).connector)),
    query: {
      enabled: computed(() => unref(unref(parameters).account) === undefined),
    },
  })
  const chainId = useChainId()

  const queryOptions = computed(() => {
    const _parameters = cloneDeepUnref<
      DeepUnwrapRef<
        UseSimulateContractParameters<
          abi,
          functionName,
          args,
          config,
          chainId,
          selectData
        >
      >
    >(parameters as any)

    const { abi, address, functionName, query = {} } = _parameters

    const options = simulateContractQueryOptions<
      config,
      abi,
      functionName,
      args,
      chainId
    >(config, {
      ..._parameters,
      account: _parameters.account ?? connectorClient.value?.account,
      chainId: _parameters.chainId ?? chainId.value,
    } as SimulateContractOptions<abi, functionName, args, config, chainId>)
    const enabled = Boolean(
      abi && address && functionName && (query.enabled ?? true),
    )

    return {
      ...query,
      ...options,
      enabled,
    }
  })

  return useQuery(queryOptions as any) as UseSimulateContractReturnType<
    abi,
    functionName,
    args,
    config,
    chainId,
    selectData
  >
}
