'use client'

import { type Config, type ResolvedRegister } from '@wagmi/core'
import { inject, unref } from 'vue'

import { WagmiProviderNotFoundError } from '../errors/plugin.js'
import { WagmiConfigInjectionKey } from '../plugin.js'
import type { MaybeRefDeep, ConfigParameter } from '../types.js'

export type UseConfigParameters<config extends Config = Config> = MaybeRefDeep<
  ConfigParameter<config>
>

export type UseConfigReturnType<config extends Config = Config> = config

/** https://beta.wagmi.sh/react/api/hooks/useConfig */
export function useConfig<config extends Config = ResolvedRegister['config']>(
  parameters: UseConfigParameters<config> = {},
): UseConfigReturnType<config> {
  const config = unref(parameters).config ?? inject(WagmiConfigInjectionKey)
  if (!config) throw new WagmiProviderNotFoundError()
  return unref(config) as UseConfigReturnType<config>
}
