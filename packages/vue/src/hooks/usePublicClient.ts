'use client'

import {
  type Config,
  type GetPublicClientParameters,
  type GetPublicClientReturnType,
  type ResolvedRegister,
  getPublicClient,
  watchPublicClient,
} from '@wagmi/core'
import type { Evaluate } from '@wagmi/core/internal'

import {
  type DeepReadonly,
  type ShallowRef,
  readonly,
  shallowRef,
} from 'vue-demi'
import type { ConfigParameter, DeepUnwrapRef, MaybeRefDeep } from '../types.js'
import { cloneDeepUnref } from '../utils/cloneDeepUnref.js'
import { useConfig } from './useConfig.js'

export type UsePublicClientParameters<
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
> = MaybeRefDeep<
  Evaluate<GetPublicClientParameters<config, chainId> & ConfigParameter<config>>
>

export type UsePublicClientReturnType<
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
> = ShallowRef<DeepReadonly<GetPublicClientReturnType<config, chainId>>>

/** https://beta.wagmi.sh/react/api/hooks/usePublicClient */
export function usePublicClient<
  config extends Config = ResolvedRegister['config'],
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
>(
  parameters: UsePublicClientParameters<config, chainId> = {},
): UsePublicClientReturnType<config, chainId> {
  const config = useConfig(parameters)
  const publicClient = shallowRef(
    getPublicClient(
      config,
      cloneDeepUnref<DeepUnwrapRef<UsePublicClientParameters<config, chainId>>>(
        parameters as any,
      ),
    ),
  )

  watchPublicClient(config, {
    onChange() {
      publicClient.value = getPublicClient(
        config,
        cloneDeepUnref<
          DeepUnwrapRef<UsePublicClientParameters<config, chainId>>
        >(parameters as any),
      )
    },
  })

  return readonly(publicClient) as unknown as UsePublicClientReturnType<
    config,
    chainId
  >
}
