import { getAccount, watchAccount } from '@wagmi/core'
import type { GetAccountResult, PublicClient } from '@wagmi/core'
import {
  getCurrentScope,
  onScopeDispose,
  ref,
  reactive,
  toRefs,
  watchEffect,
} from 'vue-demi'

import { updateState } from '../../utils'

export type UseAccountConfig = {
  /** Function to invoke when connected */
  onConnect?({
    address,
    connector,
    isReconnected,
  }: {
    address?: GetAccountResult['address']
    connector?: GetAccountResult['connector']
    isReconnected: boolean
  }): void
  /** Function to invoke when disconnected */
  onDisconnect?(): void
}

export function useAccount({ onConnect, onDisconnect }: UseAccountConfig = {}) {
  const account = reactive(getAccount()) as GetAccountResult<PublicClient>
  const previousAccount = ref<typeof account>()

  const unwatch = watchAccount(data => updateState(account, data))

  if (getCurrentScope()) onScopeDispose(() => unwatch())

  watchEffect(() => {
    if (
      previousAccount.value?.status !== 'connected' &&
      account.status === 'connected'
    ) {
      onConnect?.({
        address: account.address,
        connector: account.connector,
        isReconnected:
          previousAccount.value?.status === 'reconnecting' ||
          // if `previousAccount.status` is `undefined`, the connector connected immediately.
          previousAccount.value?.status === undefined,
      })
    }

    if (
      previousAccount.value?.status === 'connected' &&
      account.status === 'disconnected'
    ) {
      onDisconnect?.()
    }

    previousAccount.value = Object.assign({}, account)
  })

  return toRefs(account)
}
