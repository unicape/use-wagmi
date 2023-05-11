import { useMutation } from '@tanstack/vue-query'
import type { SignTypedDataArgs, SignTypedDataResult } from '@wagmi/core'
import { signTypedData } from '@wagmi/core'
import type { Never } from '@wagmi/core/internal'
import type { TypedData } from 'abitype'

import type { DeepMaybeRef, MutationConfig } from '../../types'
import { useQueryClient } from '../utils'

export type UseSignTypedDataArgs<
  TTypedData extends TypedData | { [key: string]: unknown } = TypedData,
  TPrimaryType extends string = string,
> =
  | Partial<Never<DeepMaybeRef<SignTypedDataArgs<TTypedData, TPrimaryType>>>>
  | DeepMaybeRef<SignTypedDataArgs<TTypedData, TPrimaryType>>

export type UseSignTypedDataConfig<
  TTypedData extends TypedData | { [key: string]: unknown } = TypedData,
  TPrimaryType extends string = string,
> = MutationConfig<SignTypedDataResult, Error, SignTypedDataArgs<TTypedData>> &
  UseSignTypedDataArgs<TTypedData, TPrimaryType>

function mutationKey<
  TTypedData extends TypedData | { [key: string]: unknown },
>({ domain, types, message, primaryType }: UseSignTypedDataArgs<TTypedData>) {
  return [
    { entity: 'signTypedData', domain, types, message, primaryType },
  ] as const
}

function mutationFn<TTypedData extends TypedData>(
  args: SignTypedDataArgs<TTypedData>,
) {
  const { domain, types, primaryType, message } = args
  if (!domain) throw new Error('domain is required')
  if (!types) throw new Error('types is required')
  if (!primaryType) throw new Error('primaryType is required')
  if (!message) throw new Error('message is required')
  return signTypedData({
    domain,
    message,
    primaryType,
    types,
  } as unknown as SignTypedDataArgs<TTypedData>)
}

export function useSignTypedData<
  TTypedData extends TypedData,
  TPrimaryType extends string,
>(
  {
    domain,
    types,
    message,
    primaryType,
    onError,
    onMutate,
    onSettled,
    onSuccess,
  }: UseSignTypedDataConfig<TTypedData, TPrimaryType> = {} as any,
) {
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
      domain,
      message,
      primaryType,
      types,
    } as UseSignTypedDataArgs<TTypedData>),
    mutationFn,
    {
      queryClient,
      onError,
      onMutate,
      onSettled,
      onSuccess,
    } as any,
  )

  const signTypedData = <TTypedDataMutate extends TypedData = TTypedData>(
    args?: UseSignTypedDataArgs<TTypedDataMutate>,
  ) =>
    mutate({
      domain: args?.domain ?? domain,
      types: args?.types ?? types,
      message: args?.message ?? message,
      primaryType: args?.primaryType ?? primaryType,
    } as any)

  const signTypedDataAsync =
    () =>
    <TTypedDataMutate extends TypedData = TTypedData>(
      args?: UseSignTypedDataArgs<TTypedDataMutate>,
    ) =>
      mutateAsync({
        domain: args?.domain ?? domain,
        types: args?.types ?? types,
        message: args?.message ?? message,
        primaryType: args?.primaryType ?? primaryType,
      } as any)

  return {
    data,
    error,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    reset,
    signTypedData,
    signTypedDataAsync,
    status,
    variables,
  }
}
