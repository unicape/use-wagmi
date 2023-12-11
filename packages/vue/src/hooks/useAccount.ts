'use client'

import {
  type GetAccountReturnType,
  getAccount,
  watchAccount,
} from '@wagmi/core'
import {
  type DeepReadonly,
  type ToRefs,
  reactive,
  readonly,
  toRefs,
} from 'vue-demi'

import type { ConfigParameter, MaybeRefDeep } from '../types.js'
import { updateState } from '../utils/updateState.js'
import { useConfig } from './useConfig.js'

export type UseAccountParameters = MaybeRefDeep<ConfigParameter>

export type UseAccountReturnType = ToRefs<DeepReadonly<GetAccountReturnType>>

/** https://beta.wagmi.sh/react/api/hooks/useAccount */
export function useAccount(
  parameters: UseAccountParameters = {},
): UseAccountReturnType {
  const config = useConfig(parameters)

  const account = reactive(getAccount(config))
  watchAccount(config, {
    onChange() {
      updateState(account, getAccount(config))
    },
  })

  return toRefs(readonly(account))
}
