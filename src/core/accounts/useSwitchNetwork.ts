import { computed } from 'vue-demi'
import { getWagmi } from 'use-wagmi'
import { useMutation } from 'vue-query'
import { switchNetwork } from '@wagmi/core'

import type { SwitchNetworkArgs, SwitchNetworkResult } from '@wagmi/core'
import type { MutationConfig } from '../../types'

export type UseSwitchNetworkArgs = Partial<SwitchNetworkArgs>
export type UseSwitchNetworkConfig = MutationConfig<
  SwitchNetworkResult,
  Error,
  SwitchNetworkArgs
> & {
  throwForSwitchChainNotSupported?: boolean
}

export const mutationKey = (args: UseSwitchNetworkArgs) =>
  [{ entity: 'switchNetwork', ...args }] as const

const mutationFn = (args: UseSwitchNetworkArgs) => {
  const { chainId } = args
  if (!chainId) throw new Error('chainId is required')
  return switchNetwork({ chainId })
}

export function useSwitchNetwork ({
  chainId,
  throwForSwitchChainNotSupported,
  onError,
  onMutate,
  onSettled,
  onSuccess
}: UseSwitchNetworkArgs & UseSwitchNetworkConfig = {}) {
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
    mutationKey({ chainId }),
    mutationFn,
    {
      onError,
      onMutate,
      onSettled,
      onSuccess
    }
  )

  const switchNetwork_ = (chainId_?: SwitchNetworkArgs['chainId']) =>
    mutate({ chainId: chainId_ ?? chainId } as SwitchNetworkArgs)
  
  const switchNetworkAsync_ = (chainId_?: SwitchNetworkArgs['chainId']) =>
    mutateAsync({ chainId: chainId_ ?? chainId } as SwitchNetworkArgs)

  const connector = computed(() => wagmi.value.connector)

  let switchNetwork
  let switchNetworkAsync
  const supportsSwitchChain = computed(() => !!connector.value?.switchChain)
  if (throwForSwitchChainNotSupported || supportsSwitchChain.value) {
    switchNetwork = switchNetwork_
    switchNetworkAsync = switchNetworkAsync_
  }

  return {
    chains: computed(() => wagmi.value.chains ?? []),
    data,
    error,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    pendingChainId: computed(() => variables.value?.chainId),
    reset,
    status,
    switchNetwork,
    switchNetworkAsync,
    variables
  }
}