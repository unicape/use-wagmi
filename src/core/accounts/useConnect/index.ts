import { unref, computed } from 'vue-demi'
import { useMutation } from 'vue-query'
import { getWagmi } from 'use-wagmi'
import { connect } from '@wagmi/core'

import type { ConnectArgs, ConnectResult } from '@wagmi/core'
import type { MutationConfig } from '../../../types'

export type UseConnectArgs = Partial<ConnectArgs>
export type UseConnectConfig = MutationConfig<ConnectResult, Error, ConnectArgs>

export const mutationKey = (args: UseConnectArgs) =>
  [{ entity: 'connect', ...args }] as const

const mutationFn = (args: UseConnectArgs) => {
  const { chainId, connector } = args
  if (!connector) throw new Error('connector is required')
  return connect({ chainId, connector })
}

export function useConnect ({
  chainId,
  connector,
  onError,
  onMutate,
  onSettled,
  onSuccess
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
    variables
  } = useMutation(
    mutationKey({ chainId: unref(chainId), connector: unref(connector) }),
    mutationFn,
    {
      onError,
      onMutate,
      onSettled,
      onSuccess
    }
  )

  const connect = (args?: Partial<ConnectArgs>) => {
    return mutate({
      chainId: unref(args?.chainId) || unref(chainId),
      connector: unref(args?.connector) || unref(connector)
    } as ConnectArgs)
  }

  const connectAsync = (args?: Partial<ConnectArgs>) => {
    return mutateAsync({
      chainId: unref(args?.chainId) || unref(chainId),
      connector: unref(args?.connector) || unref(connector)
    } as ConnectArgs)
  }

  return {
    connect,
    connectAsync,
    connectors: computed(() => wagmi.value.connector),
    pendingConnector: computed(() => variables?.value?.connector),
    data,
    error,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    reset,
    status,
    variables
  } as const
}