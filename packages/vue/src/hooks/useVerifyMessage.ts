import {
  type Config,
  type ResolvedRegister,
  type VerifyMessageErrorType,
} from '@wagmi/core'
import type { Evaluate } from '@wagmi/core/internal'
import {
  type VerifyMessageData,
  type VerifyMessageOptions,
  type VerifyMessageQueryKey,
  verifyMessageQueryOptions,
} from '@wagmi/core/query'
import type { VerifyMessageQueryFnData } from '@wagmi/core/query'
import { computed } from 'vue-demi'
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

export type UseVerifyMessageParameters<
  config extends Config = Config,
  selectData = VerifyMessageData,
> = MaybeRefDeep<
  Evaluate<
    VerifyMessageOptions<config> &
      ConfigParameter<config> &
      QueryParameter<
        VerifyMessageQueryFnData,
        VerifyMessageErrorType,
        selectData,
        VerifyMessageQueryKey<config>
      >
  >
>

export type UseVerifyMessageReturnType<selectData = VerifyMessageData> =
  UseQueryReturnType<selectData, VerifyMessageErrorType>

/** https://wagmi.sh/react/api/hooks/useVerifyMessage */
export function useVerifyMessage<
  config extends Config = ResolvedRegister['config'],
  selectData = VerifyMessageData,
>(
  parameters: UseVerifyMessageParameters<config, selectData> = {},
): UseVerifyMessageReturnType<selectData> {
  const config = useConfig(parameters)
  const chainId = useChainId()

  const queryOptions = computed(() => {
    const _parameters = cloneDeepUnref<
      DeepUnwrapRef<UseVerifyMessageParameters<config, selectData>>
    >(parameters as any)

    const { address, message, signature, query = {} } = _parameters
    const options = verifyMessageQueryOptions(config, {
      ..._parameters,
      chainId: _parameters.chainId ?? chainId.value,
    })
    const enabled = Boolean(
      address && message && signature && (query.enabled ?? true),
    )

    return {
      ...query,
      ...options,
      enabled,
    }
  })

  return useQuery(queryOptions as any) as UseVerifyMessageReturnType<selectData>
}
