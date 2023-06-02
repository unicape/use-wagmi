import type {
  WatchContractEventCallback,
  WatchContractEventConfig,
} from '@wagmi/core'
import type { Abi } from 'abitype'
import { unref, watchEffect } from 'vue-demi'

import type { PartialBy, ShallowMaybeRef } from '../../types'
import { usePublicClient, useWebSocketPublicClient } from '../viem'

export type UseContractEventConfig<
  TAbi extends Abi | readonly unknown[] = Abi,
  TEventName extends string = string,
> = PartialBy<
  ShallowMaybeRef<WatchContractEventConfig<TAbi, TEventName>>,
  'abi' | 'address' | 'eventName'
> & {
  listener: WatchContractEventCallback<TAbi, TEventName>
}

export function useContractEvent<
  TAbi extends Abi | readonly unknown[],
  TEventName extends string,
>(
  {
    address,
    chainId,
    abi,
    listener,
    eventName,
  }: UseContractEventConfig<TAbi, TEventName> = {} as any,
) {
  const publicClient = usePublicClient({ chainId })
  const webSocketPublicClient = useWebSocketPublicClient({ chainId })

  const unwatch = watchEffect((onCleanup) => {
    if (!unref(abi) || !unref(address) || !unref(eventName)) return

    const publicClient_ = webSocketPublicClient.value || publicClient.value
    const _unwatch = publicClient_.watchContractEvent({
      abi: unref(abi),
      address: unref(address),
      eventName: unref(eventName),
      onLogs: listener,
    } as any)

    onCleanup(() => _unwatch())
  })

  return unwatch
}
