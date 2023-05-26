import { prepareSendTransaction } from '@wagmi/core'
import type {
  GetWalletClientResult,
  PrepareSendTransactionArgs,
  PrepareSendTransactionResult,
} from '@wagmi/core'
import { computed, unref } from 'vue-demi'
import type { UnwrapRef } from 'vue-demi'

import type { DeepMaybeRef, QueryConfig, QueryFunctionArgs } from '../../types'
import { useNetwork } from '../accounts'
import { useQuery } from '../utils'
import { useWalletClient } from '../viem'

export type UsePrepareSendTransactionArgs = DeepMaybeRef<
  Partial<PrepareSendTransactionArgs>
>
export type UsePrepareSendTransactionConfig = QueryConfig<
  PrepareSendTransactionResult,
  Error
>

type QueryKeyArgs = UsePrepareSendTransactionArgs
type QueryKeyConfig = Pick<UsePrepareSendTransactionConfig, 'scopeKey'> &
  DeepMaybeRef<{
    activeChainId?: number
    walletClientAddress?: string
  }>

function queryKey({
  accessList,
  account,
  activeChainId,
  chainId,
  data,
  gas,
  gasPrice,
  maxFeePerGas,
  maxPriorityFeePerGas,
  nonce,
  to,
  value,
  scopeKey,
  walletClientAddress,
}: QueryKeyArgs & QueryKeyConfig) {
  return [
    {
      entity: 'prepareSendTransaction',
      activeChainId,
      accessList,
      account,
      chainId,
      data,
      gas,
      gasPrice,
      maxFeePerGas,
      maxPriorityFeePerGas,
      nonce,
      to,
      value,
      scopeKey,
      walletClientAddress,
    },
  ] as const
}

function queryFn({ walletClient }: { walletClient?: GetWalletClientResult }) {
  return ({
    queryKey: [
      {
        accessList,
        account,
        chainId,
        data,
        gas,
        gasPrice,
        maxFeePerGas,
        maxPriorityFeePerGas,
        nonce,
        to,
        value,
      },
    ],
  }: UnwrapRef<QueryFunctionArgs<typeof queryKey>>) => {
    if (!to) throw new Error('to is required')
    return prepareSendTransaction({
      accessList,
      account,
      chainId,
      data,
      gas,
      gasPrice,
      maxFeePerGas,
      maxPriorityFeePerGas,
      nonce,
      to,
      value,
      walletClient,
    } as PrepareSendTransactionArgs)
  }
}

/**
 * @description Hook for preparing a transaction to be sent via [`useSendTransaction`](/docs/hooks/useSendTransaction).
 *
 * Eagerly fetches the parameters required for sending a transaction such as the gas estimate and resolving an ENS address (if required).
 *
 * @example
 * import { useSendTransaction, usePrepareSendTransaction } from 'use-wagmi'
 *
 * const { request } = usePrepareSendTransaction({
 *   to: 'moxey.eth',
 *   value: parseEther('1'),
 * })
 * const result = useSendTransaction(request)
 */
export function usePrepareSendTransaction({
  accessList,
  account,
  chainId,
  cacheTime,
  data,
  enabled = true,
  gas,
  gasPrice,
  maxFeePerGas,
  maxPriorityFeePerGas,
  nonce,
  scopeKey,
  staleTime,
  suspense,
  to,
  value,
  onError,
  onSettled,
  onSuccess,
}: UsePrepareSendTransactionArgs & UsePrepareSendTransactionConfig = {}) {
  const { chain: activeChain } = useNetwork()
  const { data: walletClient } = useWalletClient({ chainId })

  const prepareSendTransactionQuery = useQuery(
    queryKey({
      accessList,
      activeChainId: activeChain?.value?.id,
      account,
      chainId,
      data,
      gas,
      gasPrice,
      maxFeePerGas,
      maxPriorityFeePerGas,
      nonce,
      scopeKey,
      to,
      value,
      walletClientAddress: walletClient.value?.account.address,
    }),
    queryFn({ walletClient: walletClient.value }),
    {
      cacheTime,
      enabled: computed(
        () => !!(unref(enabled) && unref(walletClient) && unref(to)),
      ),
      staleTime,
      suspense,
      onError,
      onSettled,
      onSuccess,
    },
  )

  return Object.assign(prepareSendTransactionQuery, {
    config: {
      mode: 'prepared',
      ...(prepareSendTransactionQuery.isSuccess
        ? prepareSendTransactionQuery.data
        : undefined),
    } as PrepareSendTransactionResult,
  })
}
