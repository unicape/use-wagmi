import type {
  Config,
  Connector,
  EstimateGasErrorType,
  ResolvedRegister,
} from '@wagmi/core'
import {
  type EstimateGasData,
  type EstimateGasOptions,
  type EstimateGasQueryFnData,
  type EstimateGasQueryKey,
  estimateGasQueryOptions,
} from '@wagmi/core/query'

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
import {
  type UseConnectorClientParameters,
  useConnectorClient,
} from './useConnectorClient.js'

export type UseEstimateGasParameters<
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] | undefined = undefined,
  selectData = EstimateGasData,
> = MaybeRefDeep<
  EstimateGasOptions<config, chainId> &
    ConfigParameter<config> &
    QueryParameter<
      EstimateGasQueryFnData,
      EstimateGasErrorType,
      selectData,
      EstimateGasQueryKey<config, chainId>
    >
>

export type UseEstimateGasReturnType<selectData = EstimateGasData> =
  UseQueryReturnType<selectData, EstimateGasErrorType>

/** https://wagmi.sh/react/api/hooks/useEstimateGas */
export function useEstimateGas<
  config extends Config = ResolvedRegister['config'],
  chainId extends config['chains'][number]['id'] | undefined = undefined,
  selectData = EstimateGasData,
>(
  parameters?: UseEstimateGasParameters<config, chainId, selectData>,
): UseEstimateGasReturnType<selectData>

export function useEstimateGas(
  parameters: UseEstimateGasParameters = {},
): UseEstimateGasReturnType {
  const config = useConfig(parameters)
  const { data: connectorClient } = useConnectorClient({
    connector: computed(() => unref(unref(parameters).connector)),
    query: computed(() => ({
      enabled: unref(unref(parameters).account) === undefined,
    })),
  } as unknown as UseConnectorClientParameters)
  const chainId = useChainId()

  const queryOptions = computed(() => {
    const _parameters = cloneDeepUnref<DeepUnwrapRef<UseEstimateGasParameters>>(
      parameters as any,
    )

    const { connector, query = {} } = _parameters
    const account = _parameters.account ?? connectorClient.value?.account

    const options = estimateGasQueryOptions(config, {
      ..._parameters,
      account,
      chainId: _parameters.chainId ?? chainId.value,
      connector: connector as Connector,
    })
    const enabled = Boolean((account || connector) && (query.enabled ?? true))

    return {
      ...query,
      ...options,
      enabled,
    }
  })

  return useQuery(queryOptions as any) as UseEstimateGasReturnType
}
