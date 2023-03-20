import { unref, watchEffect } from 'vue-demi'
import { useProvider, useWebSocketProvider } from '../providers'
import { useChainId } from '../../utils'

import type { Transaction } from 'ethers'
import type { MaybeRef } from '../../types'

export type UseWatchPendingTransactionsConfig = {
  /** The chain ID to listen on. */
  chainId?: MaybeRef<number>
  /** Subscribe to changes */
  enabled?: MaybeRef<boolean>
  /** Function fires when a pending transaction enters the mempool. */
  listener: (transaction: Transaction) => void
}

export function useWatchPendingTransactions ({
  chainId: chainId_,
  enabled = true,
  listener
}: UseWatchPendingTransactionsConfig) {
  const chainId = useChainId({ chainId: chainId_ })
  const provider = useProvider({ chainId })
  const webSocketProvider = useWebSocketProvider({ chainId })

  watchEffect(onCleanup => {
    if (!unref(enabled)) return

    const provider_ = webSocketProvider.value ?? provider.value
    provider_.on('pending', listener)

    onCleanup(() => provider_.off('pending', listener))
  })
}