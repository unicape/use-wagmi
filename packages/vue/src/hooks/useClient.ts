'use client'

import {
  type Config,
  type GetClientParameters,
  type GetClientReturnType,
  type ResolvedRegister,
  getClient,
  watchClient,
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

export type UseClientParameters<
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] | number | undefined =
    | config['chains'][number]['id']
    | undefined,
> = MaybeRefDeep<
  Evaluate<GetClientParameters<config, chainId> & ConfigParameter<config>>
>

export type UseClientReturnType<
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] | number | undefined =
    | config['chains'][number]['id']
    | undefined,
> = ShallowRef<DeepReadonly<GetClientReturnType<config, chainId>>>

/** https://wagmi.sh/react/api/hooks/useClient */
export function useClient<
  config extends Config = ResolvedRegister['config'],
  chainId extends config['chains'][number]['id'] | number | undefined =
    | config['chains'][number]['id']
    | undefined,
>(
  parameters: UseClientParameters<config, chainId> = {},
): UseClientReturnType<config, chainId> {
  const config = useConfig(parameters)
  const client = shallowRef(
    getClient(
      config,
      cloneDeepUnref<GetClientParameters<config, chainId>>(parameters as any),
    ),
  )

  watchClient(config, {
    onChange() {
      client.value = getClient(
        config,
        cloneDeepUnref<GetClientParameters<config, chainId>>(parameters as any),
      )
    },
  })

  return readonly(client) as unknown as UseClientReturnType<config, chainId>
}
