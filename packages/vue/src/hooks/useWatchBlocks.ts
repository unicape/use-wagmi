import {
  type Config,
  type ResolvedRegister,
  type WatchBlocksParameters,
  watchBlocks,
} from '@wagmi/core'
import { type UnionEvaluate, type UnionPartial } from '@wagmi/core/internal'
import type { BlockTag } from 'viem'
import { watchEffect } from 'vue-demi'

import type {
  ConfigParameter,
  EnabledParameter,
  MaybeRefDeep,
} from '../types.js'
import { cloneDeepUnref } from '../utils/cloneDeepUnref.js'
import { useChainId } from './useChainId.js'
import { useConfig } from './useConfig.js'

export type UseWatchBlocksParameters<
  includeTransactions extends boolean = false,
  blockTag extends BlockTag = 'latest',
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
> = MaybeRefDeep<
  UnionEvaluate<
    UnionPartial<
      WatchBlocksParameters<includeTransactions, blockTag, config, chainId>
    > &
      ConfigParameter<config> &
      EnabledParameter
  >
>

export type UseWatchBlocksReturnType = void

/** https://wagmi.sh/react/hooks/useWatchBlocks */
export function useWatchBlocks<
  config extends Config = ResolvedRegister['config'],
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
  includeTransactions extends boolean = false,
  blockTag extends BlockTag = 'latest',
>(
  parameters: UseWatchBlocksParameters<
    includeTransactions,
    blockTag,
    config,
    chainId
  > = {} as any,
): UseWatchBlocksReturnType {
  const config = useConfig(parameters)
  const configChainId = useChainId()

  watchEffect((onCleanup) => {
    const _parameters = cloneDeepUnref(parameters)
    const { enabled = true, onBlock, config: _, ...rest } = _parameters
    const chainId = _parameters.chainId ?? configChainId.value

    if (!enabled) return
    if (!onBlock) return
    const unwatch = watchBlocks(config, {
      ...(rest as any),
      chainId,
      onBlock,
    })

    onCleanup(unwatch)
  })
}
