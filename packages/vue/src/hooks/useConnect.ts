'use client'

import { useMutation } from '@tanstack/vue-query'
import {
  type Config,
  type ConnectErrorType,
  type Connector,
  type ResolvedRegister,
} from '@wagmi/core'
import type { Evaluate } from '@wagmi/core/internal'
import {
  type ConnectData,
  type ConnectVariables,
  connectMutationOptions,
} from '@wagmi/core/query'
import { watchEffect } from 'vue-demi'

import type {
  ConfigParameter,
  MaybeRefDeep,
  Mutate,
  MutateAsync,
} from '../types.js'
import type {
  UseMutationParameters,
  UseMutationReturnType,
} from '../utils/query.js'
import { useConfig } from './useConfig.js'
import { useConnectors } from './useConnectors.js'

type ConnectMutate<config extends Config, context = unknown> = Mutate<
  ConnectData<config>,
  ConnectErrorType,
  ConnectVariables<config>,
  context
>

type ConnectMutateAsync<config extends Config, context = unknown> = MutateAsync<
  ConnectData<config>,
  ConnectErrorType,
  ConnectVariables<config>,
  context
>

export type UseConnectParameters<
  config extends Config = Config,
  context = unknown,
> = Evaluate<
  MaybeRefDeep<ConfigParameter<config>> & {
    mutation?:
      | UseMutationParameters<
          ConnectData<config>,
          ConnectErrorType,
          ConnectVariables<config>,
          context
        >
      | undefined
  }
>

export type UseConnectReturnType<
  config extends Config = Config,
  context = unknown,
> = Evaluate<
  UseMutationReturnType<
    ConnectData<config>,
    ConnectErrorType,
    ConnectVariables<config>,
    context
  > & {
    connect: ConnectMutate<config, context>
    connectAsync: ConnectMutateAsync<config, context>
    connectors: readonly Connector[]
  }
>

export function useConnect<
  config extends Config = ResolvedRegister['config'],
  context = unknown,
>(parameters: UseConnectParameters<config, context> = {}) {
  const { mutation } = parameters

  const config = useConfig(parameters)
  const connectors = useConnectors({ config })

  const mutationOptions = connectMutationOptions(config)
  const { mutate, mutateAsync, ...result } = useMutation({
    ...mutation,
    ...mutationOptions,
  })

  watchEffect((onCleanup) => {
    const unsubscribe = config.subscribe(
      ({ status }) => status,
      (status, previousStatus) => {
        if (previousStatus !== 'disconnected' && status === 'disconnected')
          result.reset()
      },
    )

    onCleanup(unsubscribe)
  })

  return {
    ...result,
    connect: mutate,
    connectAsync: mutateAsync,
    connectors,
  }
}
