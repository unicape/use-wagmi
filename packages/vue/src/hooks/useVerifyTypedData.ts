'use client'

import {
  type Config,
  type ResolvedRegister,
  type VerifyTypedDataErrorType,
} from '@wagmi/core'
import {
  type VerifyTypedDataData,
  type VerifyTypedDataOptions,
  type VerifyTypedDataQueryKey,
  verifyTypedDataQueryOptions,
} from '@wagmi/core/query'
import type { VerifyTypedDataQueryFnData } from '@wagmi/core/query'
import { type TypedData } from 'viem'
import { computed } from 'vue-demi'
import type { ConfigParameter, MaybeRefDeep, QueryParameter } from '../types.js'
import { cloneDeepUnref } from '../utils/cloneDeepUnref.js'
import { type UseQueryReturnType, useQuery } from '../utils/query.js'
import { useChainId } from './useChainId.js'
import { useConfig } from './useConfig.js'

export type UseVerifyTypedDataParameters<
  typedData extends TypedData | Record<string, unknown> = TypedData,
  primaryType extends keyof typedData | 'EIP712Domain' = keyof typedData,
  config extends Config = Config,
  selectData = VerifyTypedDataData,
> = MaybeRefDeep<
  VerifyTypedDataOptions<typedData, primaryType, config> &
    ConfigParameter<config> &
    QueryParameter<
      VerifyTypedDataQueryFnData,
      VerifyTypedDataErrorType,
      selectData,
      VerifyTypedDataQueryKey<typedData, primaryType, config>
    >
>

export type UseVerifyTypedDataReturnType<selectData = VerifyTypedDataData> =
  UseQueryReturnType<selectData, VerifyTypedDataErrorType>

/** https://wagmi.sh/react/api/hooks/useVerifyTypedData */
export function useVerifyTypedData<
  const typedData extends TypedData | Record<string, unknown>,
  primaryType extends keyof typedData | 'EIP712Domain',
  config extends Config = ResolvedRegister['config'],
  selectData = VerifyTypedDataData,
>(
  parameters: UseVerifyTypedDataParameters<
    typedData,
    primaryType,
    config,
    selectData
  > = {} as any,
): UseVerifyTypedDataReturnType<selectData> {
  const config = useConfig(parameters)
  const chainId = useChainId()

  const queryOptions = computed(() => {
    const _parameters = cloneDeepUnref(parameters as any)

    const {
      address,
      message,
      primaryType,
      signature,
      types,
      query = {},
    } = _parameters
    const options = verifyTypedDataQueryOptions<config, typedData, primaryType>(
      config,
      {
        ..._parameters,
        chainId: _parameters.chainId ?? chainId.value,
      },
    )
    const enabled = Boolean(
      address &&
        message &&
        primaryType &&
        signature &&
        types &&
        (query.enabled ?? true),
    )

    return {
      ...query,
      ...options,
      enabled,
    }
  })

  return useQuery(
    queryOptions as any,
  ) as UseVerifyTypedDataReturnType<selectData>
}
