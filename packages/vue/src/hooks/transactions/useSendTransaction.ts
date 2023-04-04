import { sendTransaction } from '@wagmi/core'

import type {
  SendTransactionArgs,
  SendTransactionPreparedRequest,
  SendTransactionResult,
  SendTransactionUnpreparedRequest,
} from '@wagmi/core'
import { unref } from 'vue-demi'

import type { DeepMaybeRef, MutationConfig } from '../../types'
import { useMutation } from '../utils'

export type UseSendTransactionArgs = DeepMaybeRef<
  Omit<SendTransactionArgs, 'request' | 'type'> &
    (
      | {
          /**
           * `recklesslyUnprepared`: Allow to pass through an unprepared `request`. Note: This has
           * [UX pitfalls](https://wagmi.sh/react/prepare-hooks#ux-pitfalls-without-prepare-hooks), it
           * is highly recommended to not use this and instead prepare the request upfront
           * using the `usePrepareSendTransaction` hook.
           *
           * `prepared`: The request has been prepared with parameters required for sending a transaction
           * via the [`usePrepareSendTransaction` hook](https://wagmi.sh/react/prepare-hooks/usePrepareSendTransaction)
           * */
          mode: 'prepared'
          /** The prepared request to send the transaction. */
          request: SendTransactionPreparedRequest['request'] | undefined
        }
      | {
          mode: 'recklesslyUnprepared'
          /** The unprepared request to send the transaction. */
          request?: SendTransactionUnpreparedRequest['request']
        }
    )
>

export type UseSendTransactionMutationArgs = DeepMaybeRef<{
  /**
   * Recklessly pass through an unprepared `request`. Note: This has
   * [UX pitfalls](https://wagmi.sh/react/prepare-hooks#ux-pitfalls-without-prepare-hooks), it is
   * highly recommended to not use this and instead prepare the request upfront
   * using the `usePrepareSendTransaction` hook.
   */
  recklesslySetUnpreparedRequest: SendTransactionUnpreparedRequest['request']
}>

export const mutationKey = (args: UseSendTransactionArgs) =>
  [{ entity: 'sendTransaction', ...args }] as const

const mutationFn = ({ chainId, mode, request }: UseSendTransactionArgs) => {
  return sendTransaction({
    chainId: unref(chainId),
    mode: unref(mode),
    request: unref(request),
  } as SendTransactionArgs)
}

export type UseSendTransactionConfig = MutationConfig<
  SendTransactionResult,
  Error,
  SendTransactionArgs
>

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
  Args extends UseSendTransactionArgs = UseSendTransactionArgs,
>({
  chainId,
  mode,
  request,
  onError,
  onMutate,
  onSettled,
  onSuccess,
}: Args & UseSendTransactionConfig) {
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
      chainId,
      mode,
      request,
    } as SendTransactionArgs),
    mutationFn,
    {
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
      request: args?.recklesslySetUnpreparedRequest ?? request,
    } as SendTransactionArgs)

  const sendTransactionAsync = (args?: UseSendTransactionMutationArgs) =>
    mutateAsync({
      chainId,
      mode,
      request: args?.recklesslySetUnpreparedRequest ?? request,
    } as SendTransactionArgs)

  return {
    data,
    error,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    reset,
    sendTransaction,
    sendTransactionAsync,
    status,
    variables,
  }
}
