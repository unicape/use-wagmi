'use client'

import { type GetAccountReturnType, watchAccount } from '@wagmi/core'
import type { Evaluate } from '@wagmi/core/internal'
import { watchEffect, unref } from 'vue-demi'

import type { ConfigParameter, MaybeRefDeep } from '../types.js'
import { useConfig } from './useConfig.js'
import { cloneDeepUnref } from '../utils/cloneDeepUnref.js'

type UseAccountEffectArgs = Evaluate<
  {
    onConnect?(
      data: Evaluate<
        Pick<
          Extract<GetAccountReturnType, { status: 'connected' }>,
          'address' | 'addresses' | 'chain' | 'chainId' | 'connector'
        > & {
          isReconnected: boolean
        }
      >,
    ): void
    onDisconnect?(): void
  } & ConfigParameter
>
export type UseAccountEffectParameters = MaybeRefDeep<UseAccountEffectArgs>
// MaybeRefShallow<ConfigParameter>

/** https://beta.wagmi.sh/react/api/hooks/useAccountEffect */
export function useAccountEffect(parameters: UseAccountEffectParameters = {}) {
  const config = useConfig(parameters)

  watchEffect((onCleanup) => {
    const { config: _, ...options } = unref(parameters)
    const { onConnect, onDisconnect } =
      cloneDeepUnref<UseAccountEffectArgs>(options)

    const unwatch = watchAccount(config, {
      onChange(data, prevData) {
        if (
          (prevData.status === 'reconnecting' ||
            (prevData.status === 'connecting' &&
              prevData.address === undefined)) &&
          data.status === 'connected'
        ) {
          const { address, addresses, chain, chainId, connector } = data
          const isReconnected =
            prevData.status === 'reconnecting' ||
            // if `previousAccount.status` is `undefined`, the connector connected immediately.
            prevData.status === undefined
          onConnect?.({
            address,
            addresses,
            chain,
            chainId,
            connector,
            isReconnected,
          })
        } else if (
          prevData.status === 'connected' &&
          data.status === 'disconnected'
        )
          onDisconnect?.()
      },
    })

    onCleanup(() => unwatch())
  })
}
