import { useMutation as useMutation_ } from 'vue-query'

import type {
  MutationFunction,
  MutationKey,
  UseMutationOptions,
} from 'vue-query'

import { WagmiQueryClientKey as queryClientKey } from '../../create'

export function useMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown,
>(
  mutationKey: MutationKey,
  mutationFn: MutationFunction<TData, TVariables>,
  options: UseMutationOptions<TData, TError, TVariables, TContext>,
) {
  return useMutation_({
    mutationKey,
    mutationFn,
    ...options,
    queryClientKey,
  })
}
