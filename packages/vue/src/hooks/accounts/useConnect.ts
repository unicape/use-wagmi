import { connect } from '@wagmi/core'
import type { ConnectArgs, ConnectResult } from '@wagmi/core'
import { computed } from 'vue-demi'

import { getWagmi } from '../../create'

import type { DeepMaybeRef, MutationConfig } from '../../types'
import { useMutation } from '../utils'

export type UseConnectArgs = DeepMaybeRef<Partial<ConnectArgs>>
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
  const wagmi = getWagmi()

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
    onError,
    onMutate,
    onSettled,
    onSuccess,
  })

  const connectors = computed(() => wagmi.value.connectors)
  const pendingConnector = computed(() => variables?.value?.connector)

  const connect = (args?: UseConnectArgs) => {
    return mutate({
      chainId: args?.chainId ?? chainId,
      connector: args?.connector ?? connector,
    } as ConnectArgs)
  }

  const connectAsync = (args?: UseConnectArgs) => {
    return mutateAsync({
      chainId: args?.chainId ?? chainId,
      connector: args?.connector ?? connector,
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
