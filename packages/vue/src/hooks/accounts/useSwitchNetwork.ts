import { useMutation } from '@tanstack/vue-query'
import { switchNetwork } from '@wagmi/core'
import type { Chain, SwitchNetworkArgs, SwitchNetworkResult } from '@wagmi/core'
import { computed, unref, watchEffect } from 'vue-demi'
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

  const chains = computed(() => config.chains ?? [])
  const pendingChainId = computed(() => variables.value?.chainId)

  const switchNetwork_ = (chainId_?: UseSwitchNetworkArgs['chainId']) =>
    mutate({ chainId: unref(chainId_) ?? unref(chainId) } as SwitchNetworkArgs)

  const switchNetworkAsync_ = (chainId_?: UseSwitchNetworkArgs['chainId']) =>
    mutateAsync({
      chainId: unref(chainId_) ?? unref(chainId),
    } as SwitchNetworkArgs)

  let switchNetwork
  let switchNetworkAsync
  watchEffect(() => {
    const supportsSwitchChain = !!config.connector?.switchChain
    if (throwForSwitchChainNotSupported || supportsSwitchChain) {
      switchNetwork = switchNetwork_
      switchNetworkAsync = switchNetworkAsync_
    }
  })

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
    switchNetwork: switchNetwork as
      | ((chainId_?: UseSwitchNetworkArgs['chainId']) => void)
      | undefined,
    switchNetworkAsync: switchNetworkAsync as
      | ((chainId_?: UseSwitchNetworkArgs['chainId']) => Promise<Chain>)
      | undefined,
    variables,
  } as const
}
