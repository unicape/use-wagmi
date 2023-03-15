import { useMutation } from 'vue-query'
import { signTypedData } from '@wagmi/core'

import type { TypedData, Address } from 'abitype'
import type { SignTypedDataArgs, SignMessageResult } from '@wagmi/core'
import type { MutationConfig, PartialBy, DeepMaybeRef } from '../../types'

export type UseSignTypedDataArgs<
  TTypedData extends TypedData | { [key: string]: unknown } = TypedData
> = PartialBy<DeepMaybeRef<SignTypedDataArgs<TTypedData>>, 'domain' | 'types' | 'value'>

export type UseSignTypedDataConfig<
  TTypedData extends TypedData | { [key: string]: unknown } = TypedData
> = MutationConfig<SignMessageResult, Error, SignTypedDataArgs<TTypedData>>

function mutationKey<
  TTypedData extends TypedData | { [key: string]: unknown },
>({ domain, types, value }: UseSignTypedDataArgs<TTypedData>) {
  return [{ entity: 'signTypedData', domain, types, value }] as const
}

function mutationFn<TTypedData extends TypedData>(
  args: SignTypedDataArgs<TTypedData>,
) {
  const { domain, types, value } = args
  if (!domain) throw new Error('domain is required')
  if (!types) throw new Error('types is required')
  if (!value) throw new Error('value is required')
  return signTypedData({
    domain,
    types,
    value,
  } as unknown as SignTypedDataArgs<TTypedData>) as Promise<Address>
}

export function useSignTypedData<TTypedData extends TypedData> ({
  domain,
  types,
  value,
  onError,
  onMutate,
  onSettled,
  onSuccess
}: UseSignTypedDataArgs<TTypedData> & UseSignTypedDataConfig<TTypedData> = {} as any) {
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
    variables
  } = useMutation(
    mutationKey({
      domain,
      types,
      value
    } as UseSignTypedDataArgs<TTypedData>),
    mutationFn,
    {
      onError,
      onMutate,
      onSettled,
      onSuccess
    }
  )

  const signTypedData = <TTypedDataMutate extends TypedData = TTypedData>(
    args?: UseSignTypedDataArgs<TTypedDataMutate>
  ) => {
    return mutate({
      domain: args?.domain ?? domain,
      types: args?.types ?? types,
      value: args?.value ?? value
    } as unknown as SignTypedDataArgs<TTypedData>)
  }

  const signTypedDataAsync = <TTypedDataMutate extends TypedData = TTypedData>(
    args?: UseSignTypedDataArgs<TTypedDataMutate>
  ) => {
    return mutateAsync({
      domain: args?.domain ?? domain,
      types: args?.types ?? types,
      value: args?.value ?? value
    } as unknown as SignTypedDataArgs<TTypedData>)
  }

  return {
    data,
    error,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    signTypedData,
    signTypedDataAsync,
    reset,
    variables
  }
}