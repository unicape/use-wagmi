import { useMutation } from '@tanstack/vue-query'
import { sendTransaction } from '@wagmi/core'
import type { SendTransactionArgs, SendTransactionResult } from '@wagmi/core'

import type { DeepMaybeRef, MutationConfig } from '../../types'
import { useQueryClient } from '../utils'

export type UseSendTransactionArgs<
  TMode extends 'prepared' | undefined = 'prepared' | undefined,
> = DeepMaybeRef<
  Omit<SendTransactionArgs, 'to'> & { mode?: TMode; to?: string }
>
export type UseSendTransactionMutationArgs = DeepMaybeRef<SendTransactionArgs>
export type UseSendTransactionConfig = MutationConfig<
  SendTransactionResult,
  Error,
  UseSendTransactionArgs
>

type SendTransactionFn = (
  overrideConfig?: UseSendTransactionMutationArgs,
) => void
type SendTransactionAsyncFn = (
  overrideConfig?: UseSendTransactionMutationArgs,
) => Promise<SendTransactionResult>
type MutateFnReturnValue<TMode, TFn> = TMode extends 'prepared'
  ? TFn | undefined
  : TFn

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

  const sendTransaction = (args?: UseSendTransactionMutationArgs) =>
    mutate({
      chainId,
      mode,
      ...(args ||
        ({
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
        } as any)),
    })

  const sendTransactionAsync = (args?: UseSendTransactionMutationArgs) =>
    mutateAsync({
      chainId,
      mode,
      ...(args ||
        ({
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
        } as any)),
    })

  return {
    data,
    error,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    reset,
    sendTransaction: (mode === 'prepared' && !to
      ? undefined
      : sendTransaction) as MutateFnReturnValue<TMode, SendTransactionFn>,
    sendTransactionAsync: (mode === 'prepared' && !to
      ? undefined
      : sendTransactionAsync) as MutateFnReturnValue<
      TMode,
      SendTransactionAsyncFn
    >,
    status,
    variables,
  }
}
