import { useMutation } from '@tanstack/vue-query'
import { switchNetwork } from '@wagmi/core'
import type { SwitchNetworkArgs, SwitchNetworkResult } from '@wagmi/core'
import { computed, unref } from 'vue-demi'
import type { UnwrapRef } from 'vue-demi'

import { useConfig } from '../../plugin'
import type { MaybeRef, MutationConfig, ShallowMaybeRef } from '../../types'
import { useQueryClient } from '../utils'

export type UseSwitchNetworkArgs = Partial<ShallowMaybeRef<SwitchNetworkArgs>>
export type UseSwitchNetworkConfig = MutationConfig<
  SwitchNetworkResult,
  Error,
  SwitchNetworkArgs
> & {
  throwForSwitchChainNotSupported?: MaybeRef<boolean>
}

export const mutationKey = (args: UseSwitchNetworkArgs) =>
  [{ entity: 'switchNetwork', ...args }] as const

const mutationFn = (args: UnwrapRef<UseSwitchNetworkArgs>) => {
  const { chainId } = args
  if (!chainId) throw new Error('chainId is required')
  return switchNetwork({ chainId })
}

export function useSwitchNetwork({
  chainId,
  throwForSwitchChainNotSupported,
  onError,
  onMutate,
  onSettled,
  onSuccess,
}: UseSwitchNetworkArgs & UseSwitchNetworkConfig = {}) {
  const queryClient = useQueryClient()
  const config = useConfig()

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
  } = useMutation(mutationKey({ chainId }), mutationFn, {
    queryClient,
    onError,
    onMutate,
    onSettled,
    onSuccess,
  })

  const chains = computed(() => config.value.chains ?? [])
  const pendingChainId = computed(() => variables.value?.chainId)
  const supports = computed(
    () =>
      unref(throwForSwitchChainNotSupported) ||
      !!config.value.connector?.switchChain,
  )

  const switchNetwork = (chainId_?: UseSwitchNetworkArgs['chainId']) =>
    mutate({ chainId: unref(chainId_) ?? unref(chainId) } as SwitchNetworkArgs)

  const switchNetworkAsync = (chainId_?: UseSwitchNetworkArgs['chainId']) =>
    mutateAsync({
      chainId: unref(chainId_) ?? unref(chainId),
    } as SwitchNetworkArgs)

  return {
    chains,
    data,
    error,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    pendingChainId,
    reset,
    status,
    supports,
    switchNetwork,
    switchNetworkAsync,
    variables,
  } as const
}
