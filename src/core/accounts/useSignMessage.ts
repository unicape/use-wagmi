import { unref } from 'vue-demi'
import { useMutation } from 'vue-query'
import { signMessage } from '@wagmi/core'

import type { SignMessageArgs, SignMessageResult } from '@wagmi/core'
import type { MutationConfig, SetMaybeRef } from './../../types'

export type UseSignMessageArgs = Partial<SignMessageArgs>

export type UseSignMessageConfig = MutationConfig<
  SignMessageResult,
  Error,
  SignMessageArgs
>

export const mutationKey = (args: UseSignMessageArgs) =>
  [{ entity: 'signMessage', ...args }] as const

const mutationFn = (args: UseSignMessageArgs) => {
  const { message } = args
  if (!message) throw new Error('message is required')
  return signMessage({ message })
}

export function useSignMessage ({
  message,
  onError,
  onMutate,
  onSettled,
  onSuccess
}: SetMaybeRef<UseSignMessageArgs> & UseSignMessageConfig = {}) {
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
    variables
  } = useMutation(
    mutationKey({ message: unref(message) }),
    mutationFn,
    {
      onError,
      onMutate,
      onSettled,
      onSuccess
    }
  )

  const signMessage = (args?: SignMessageArgs) => {
    return mutate({
      message: unref(args?.message ?? message)
    } as SignMessageArgs)
  }

  const signMessageAsync = (args?: SignMessageArgs) => {
    return mutateAsync({
      message: unref(args?.message ?? message)
    } as SignMessageArgs)
  }

  return {
    data,
    error,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    reset,
    signMessage,
    signMessageAsync,
    status,
    variables
  }
}