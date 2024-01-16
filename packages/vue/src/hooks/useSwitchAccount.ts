'use client'

import { useMutation } from '@tanstack/vue-query'
import {
  type Config,
  type Connector,
  type ResolvedRegister,
  type SwitchAccountErrorType,
  getConnections,
  watchConnections,
} from '@wagmi/core'
import type { Evaluate } from '@wagmi/core/internal'
import {
  type SwitchAccountData,
  type SwitchAccountMutate,
  type SwitchAccountMutateAsync,
  type SwitchAccountVariables,
  switchAccountMutationOptions,
} from '@wagmi/core/query'
import { type Ref, computed, shallowRef } from 'vue-demi'

import type { ConfigParameter, MaybeRefDeep } from '../types.js'
import type {
  UseMutationParameters,
  UseMutationReturnType,
} from '../utils/query.js'
import { useConfig } from './useConfig.js'

export type UseSwitchAccountParameters<
  config extends Config = Config,
  context = unknown,
> = Evaluate<
  MaybeRefDeep<ConfigParameter<config>> & {
    mutation?:
      | UseMutationParameters<
          SwitchAccountData<config>,
          SwitchAccountErrorType,
          SwitchAccountVariables,
          context
        >
      | undefined
  }
>

export type UseSwitchAccountReturnType<
  config extends Config = Config,
  context = unknown,
> = Evaluate<
  UseMutationReturnType<
    SwitchAccountData<config>,
    SwitchAccountErrorType,
    SwitchAccountVariables,
    context
  > & {
    connectors: Ref<readonly Connector[]>
    switchAccount: SwitchAccountMutate<config, context>
    switchAccountAsync: SwitchAccountMutateAsync<config, context>
  }
>

/** https://wagmi.sh/react/api/hooks/useSwitchAccount */
export function useSwitchAccount<
  config extends Config = ResolvedRegister['config'],
  context = unknown,
>(
  parameters: UseSwitchAccountParameters<config, context> = {},
): UseSwitchAccountReturnType<config, context> {
  const { mutation } = parameters

  const config = useConfig(parameters)
  const connections = shallowRef(getConnections(config))

  watchConnections(config, {
    onChange() {
      connections.value = getConnections(config)
    },
  })

  const mutationOptions = switchAccountMutationOptions(config)
  const { mutate, mutateAsync, ...result } = useMutation({
    ...mutation,
    ...mutationOptions,
  })

  return {
    ...result,
    connectors: computed(() =>
      connections.value.map((connection) => connection.connector),
    ),
    switchAccount: mutate,
    switchAccountAsync: mutateAsync,
  }
}
