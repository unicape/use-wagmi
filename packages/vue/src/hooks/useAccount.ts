'use client'

import {
  type GetAccountReturnType,
  getAccount,
  watchAccount,
} from '@wagmi/core'
import { type ToRefs, reactive, toRefs } from 'vue'

import type { DeepMaybeRef } from '../types/index.js'
import type { ConfigParameter } from '../types/properties.js'
import { updateState } from '../utils/updateState.js'
import { useConfig } from './useConfig.js'

export type UseAccountParameters = DeepMaybeRef<ConfigParameter>

export type UseAccountReturnType = ToRefs<GetAccountReturnType>

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

  return toRefs(account) as UseAccountReturnType
}
