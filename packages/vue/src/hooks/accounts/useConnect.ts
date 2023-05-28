import { useMutation } from '@tanstack/vue-query'
import { connect } from '@wagmi/core'
import type { ConnectArgs, ConnectResult } from '@wagmi/core'
import { computed, toRaw, unref } from 'vue-demi'

import { useConfig } from '../../plugin'
import type { MutationConfig, ShallowMaybeRef } from '../../types'
import { useQueryClient } from '../utils'

export type UseConnectArgs = ShallowMaybeRef<Partial<ConnectArgs>>
export type UseConnectConfig = MutationConfig<ConnectResult, Error, ConnectArgs>

export const mutationKey = (args: UseConnectArgs) =>
  [{ entity: 'connect', ...args }] as const

const mutationFn = (args: ConnectArgs) => {
  const { chainId, connector } = args
  if (!connector) throw new Error('connector is required')
  return connect({ chainId, connector })
}

export function useConnect({
  chainId,
  connector,
  onError,
  onMutate,
  onSettled,
  onSuccess,
}: UseConnectArgs & UseConnectConfig = {}) {
  const config = useConfig()
  const queryClient = useQueryClient()

  const {
    data,
    error,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    mutate,
    mutateAsync,
    reset,
    status,
    variables,
  } = useMutation(mutationKey({ chainId, connector }), mutationFn, {
    queryClient,
    onError,
    onMutate,
    onSettled,
    onSuccess,
  })

  const connectors = computed(() => config.value.connectors)
  const pendingConnector = computed(() => variables?.value?.connector)

  const connect = (args?: UseConnectArgs) => {
    return mutate({
      chainId: unref(args?.chainId) ?? unref(chainId),
      connector: toRaw(unref(args?.connector)) ?? toRaw(connector),
    } as ConnectArgs)
  }

  const connectAsync = (args?: UseConnectArgs) => {
    return mutateAsync({
      chainId: unref(args?.chainId) ?? unref(chainId),
      connector: toRaw(unref(args?.connector)) ?? toRaw(connector),
    } as ConnectArgs)
  }

  return {
    connect,
    connectAsync,
    connectors,
    pendingConnector,
    data,
    error,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    reset,
    status,
    variables,
  } as const
}
