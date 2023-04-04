import type { WatchContractEventConfig } from '@wagmi/core'
import type {
  Abi,
  AbiEvent,
  AbiParametersToPrimitiveTypes,
  ExtractAbiEvent,
} from 'abitype'
import { ref, unref, watchEffect } from 'vue-demi'

import { useContract } from './useContract'
import type { DeepMaybeRef, PartialBy } from '../../types'
import { useProvider, useWebSocketProvider } from '../providers'

export type UseContractEventConfig<
  TAbi extends Abi | readonly unknown[] = Abi,
  TEventName extends string = string,
> = PartialBy<
  DeepMaybeRef<WatchContractEventConfig<TAbi, TEventName>> &
    GetListener<TAbi, TEventName>,
  'abi' | 'address' | 'eventName'
>

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
    once,
  }: UseContractEventConfig<TAbi, TEventName> = {} as any,
) {
  const provider = useProvider({ chainId })
  const webSocketProvider = useWebSocketProvider({ chainId })
  const contract = useContract({
    address,
    // TODO: Remove cast and still support `Narrow<TAbi>`
    abi: abi as Abi,
    signerOrProvider: webSocketProvider ?? provider,
  })

  const callbackRef = ref(listener)
  callbackRef.value = listener

  watchEffect((onCleanup) => {
    if (!unref(contract) || !unref(eventName)) return

    const handler = (...event: any[]) =>
      (callbackRef.value as (...args: readonly unknown[]) => void)(...event)

    if (unref(once)) contract.value?.once(unref(eventName) as string, handler)
    else contract.value?.on(unref(eventName) as string, handler)

    onCleanup(() => {
      contract.value?.off(unref(eventName) as string, handler)
    })
  })
}

type GetListener<
  TAbi extends Abi | readonly unknown[],
  TEventName extends string,
  TAbiEvent extends AbiEvent = TAbi extends Abi
    ? ExtractAbiEvent<TAbi, TEventName>
    : AbiEvent,
  TArgs = AbiParametersToPrimitiveTypes<TAbiEvent['inputs']>,
  FailedToParseArgs =
    | ([TArgs] extends [never] ? true : false)
    | (readonly unknown[] extends TArgs ? true : false),
> = true extends FailedToParseArgs
  ? {
      /**
       * Callback when event is emitted
       *
       * Use a [const assertion](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions) on {@link abi} for type inference.
       */
      listener: (...args: unknown[]) => void
    }
  : {
      /** Callback when event is emitted */ listener: (
        ...args: TArgs extends readonly unknown[] ? TArgs : unknown[]
      ) => void
    }
