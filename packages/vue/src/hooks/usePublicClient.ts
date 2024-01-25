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
import type { ConfigParameter, MaybeRefDeep } from '../types.js'
import { cloneDeepUnref } from '../utils/cloneDeepUnref.js'
import { useConfig } from './useConfig.js'

export type UsePublicClientParameters<
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] | number | undefined =
    | config['chains'][number]['id']
    | undefined,
> = MaybeRefDeep<
  Evaluate<GetPublicClientParameters<config, chainId> & ConfigParameter<config>>
>

export type UsePublicClientReturnType<
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] | number | undefined =
    | config['chains'][number]['id']
    | undefined,
> = ShallowRef<DeepReadonly<GetPublicClientReturnType<config, chainId>>>

/** https://wagmi.sh/react/api/hooks/usePublicClient */
export function usePublicClient<
  config extends Config = ResolvedRegister['config'],
  chainId extends config['chains'][number]['id'] | number | undefined =
    | config['chains'][number]['id']
    | undefined,
>(
  parameters: UsePublicClientParameters<config, chainId> = {},
): UsePublicClientReturnType<config, chainId> {
  const config = useConfig(parameters)
  const publicClient = shallowRef(
    getPublicClient(
      config,
      cloneDeepUnref<GetPublicClientParameters<config, chainId>>(
        parameters as any,
      ),
    ),
  )

  watchPublicClient(config, {
    onChange() {
      publicClient.value = getPublicClient(
        config,
        cloneDeepUnref<GetPublicClientParameters<config, chainId>>(
          parameters as any,
        ),
      )
    },
  })

  return readonly(publicClient) as unknown as UsePublicClientReturnType<
    config,
    chainId
  >
}
