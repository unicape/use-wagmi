'use client'

import {
  type Config,
  type GetAccountReturnType,
  type ResolvedRegister,
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

export type UseAccountParameters<config extends Config = Config> = MaybeRefDeep<
  ConfigParameter<config>
>

export type UseAccountReturnType<config extends Config = Config> = ToRefs<
  DeepReadonly<GetAccountReturnType<config>>
>

/** https://wagmi.sh/react/api/hooks/useAccount */
export function useAccount<config extends Config = ResolvedRegister['config']>(
  parameters: UseAccountParameters<config> = {},
): UseAccountReturnType<config> {
  const config = useConfig(parameters)

  const account = reactive(getAccount(config))
  watchAccount(config, {
    onChange() {
      updateState(account, getAccount(config))
    },
  })

  return toRefs(readonly(account)) as UseAccountReturnType<config>
}
