import { useMutation } from '@tanstack/vue-query'
import { sendTransaction } from '@wagmi/core'
import type { SendTransactionArgs, SendTransactionResult } from '@wagmi/core'
import { computed, unref } from 'vue-demi'

import type { MutationConfig, ShallowMaybeRef } from '../../types'
import { cloneDeepUnref } from '../../utils'
import { useQueryClient } from '../utils'

export type UseSendTransactionArgs<
  TMode extends 'prepared' | undefined = 'prepared' | undefined,
> = ShallowMaybeRef<
  Omit<SendTransactionArgs, 'to'> & { mode?: TMode; to?: string }
>
export type UseSendTransactionMutationArgs =
  ShallowMaybeRef<SendTransactionArgs>
export type UseSendTransactionConfig = MutationConfig<
  SendTransactionResult,
  Error,
  UseSendTransactionArgs
>

export const mutationKey = (args: UseSendTransactionArgs) =>
  [{ entity: 'sendTransaction', ...args }] as const

const mutationFn = ({
  accessList,
  account,
  chainId,
  data,
  gas,
  gasPrice,
  maxFeePerGas,
  maxPriorityFeePerGas,
  mode,
  nonce,
  to,
  value,
}: SendTransactionArgs) => {
  if (!to) throw new Error('to is required.')
  return sendTransaction({
    accessList,
    account,
    chainId,
    data,
    gas,
    gasPrice,
    maxFeePerGas,
    maxPriorityFeePerGas,
    mode,
    nonce,
    to,
    value,
  })
}

/**
 * @description Hook for sending a transaction.
 *
 * It is recommended to pair this with the [`usePrepareSendTransaction` hook](/docs/prepare-hooks/usePrepareSendTransaction)
 * to [avoid UX pitfalls](https://wagmi.sh/react/prepare-hooks#ux-pitfalls-without-prepare-hooks).
 *
 * @example
 * import { useSendTransaction, usePrepareSendTransaction } from 'use-wagmi'
 *
 * const config = usePrepareSendTransaction({
 *   request: {
 *     to: 'moxey.eth',
 *     value: parseEther('1'),
 *   }
 * })
 * const result = useSendTransaction(config)
 */
export function useSendTransaction<
  TMode extends 'prepared' | undefined = undefined,
>({
  accessList,
  account,
  chainId,
  data: data_,
  gas,
  gasPrice,
  maxFeePerGas,
  maxPriorityFeePerGas,
  mode,
  nonce,
  to,
  value,
  onError,
  onMutate,
  onSettled,
  onSuccess,
}: UseSendTransactionArgs<TMode> & UseSendTransactionConfig = {}) {
  const queryClient = useQueryClient()

  const {
    data,
    error,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    mutate,
    mutateAsync,
    reset,
    status,
    variables,
  } = useMutation(
    mutationKey({
      accessList,
      account,
      chainId,
      data: data_,
      gas,
      gasPrice,
      maxFeePerGas,
      maxPriorityFeePerGas,
      mode,
      nonce,
      to,
      value,
    }),
    mutationFn,
    {
      queryClient,
      onError,
      onMutate,
      onSettled,
      onSuccess,
    },
  )

  const disabled = computed(() => unref(mode) === 'prepared' && !unref(to))

  const sendTransaction = (args?: UseSendTransactionMutationArgs) => {
    const _args = cloneDeepUnref({
      chainId,
      mode,
      ...(args || {
        accessList,
        account,
        chainId,
        data: data_,
        gas,
        gasPrice,
        maxFeePerGas,
        maxPriorityFeePerGas,
        mode,
        nonce,
        value,
        to,
      }),
    })
    mutate(_args as SendTransactionArgs)
  }

  const sendTransactionAsync = (args?: UseSendTransactionMutationArgs) => {
    const _args = cloneDeepUnref({
      chainId,
      mode,
      ...(args || {
        accessList,
        account,
        chainId,
        data: data_,
        gas,
        gasPrice,
        maxFeePerGas,
        maxPriorityFeePerGas,
        mode,
        nonce,
        value,
        to,
      }),
    })
    mutateAsync(_args as SendTransactionArgs)
  }

  return {
    data,
    error,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    reset,
    disabled,
    sendTransaction,
    sendTransactionAsync,
    status,
    variables,
  }
}
