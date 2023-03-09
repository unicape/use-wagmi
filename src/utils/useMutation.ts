import { useMutation as useMutation_ } from 'vue-query'
import { WagmiQueryClientKey as queryClientKey } from '../create'

import type { MutationKey, MutationFunction, UseMutationOptions } from 'vue-query'

export function useMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
> (
  mutationKey: MutationKey,
  mutationFn: MutationFunction<TData, TVariables>,
  options: UseMutationOptions<TData, TError, TVariables, TContext>
) {
  return useMutation_({
    mutationKey,
    mutationFn,
    ...options,
    queryClientKey
  })
}