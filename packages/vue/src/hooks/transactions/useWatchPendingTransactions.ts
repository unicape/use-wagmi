import type { WatchPendingTransactionsCallback } from '@wagmi/core'
import { unref, watchEffect } from 'vue-demi'

import type { ShallowMaybeRef } from '../../types'
import { useChainId } from '../utils'
import { usePublicClient, useWebSocketPublicClient } from '../viem'

export type UseWatchPendingTransactionsConfig = ShallowMaybeRef<{
  /** The chain ID to listen on. */
  chainId?: number
  /** Subscribe to changes */
  enabled?: boolean
}> & {
  /** Function fires when a pending transaction enters the mempool. */
  listener: WatchPendingTransactionsCallback
}

export function useWatchPendingTransactions({
  chainId: chainId_,
  enabled = true,
  listener,
}: UseWatchPendingTransactionsConfig) {
  const chainId = useChainId({ chainId: chainId_ })
  const publicClient = usePublicClient({ chainId })
  const webSocketPublicClient = useWebSocketPublicClient({ chainId })

  watchEffect((onCleanup) => {
    if (!unref(enabled)) return

    const publicClient_ = webSocketPublicClient.value ?? publicClient.value
    const unwatch = publicClient_.watchPendingTransactions({
      onTransactions: listener,
    })

    onCleanup(() => unwatch())
  })
}
