import {
  type DefaultError,
  type QueryKey,
  type UseQueryReturnType as UQRT,
  type UseQueryOptions,
  type UseMutationOptions,
  type MutationObserverResult,
  useQuery as tanstack_useQuery,
} from '@tanstack/vue-query'
import {
  type Evaluate,
  type ExactPartial,
  type Omit,
} from '@wagmi/core/internal'
import { hashFn } from '@wagmi/core/query'
import { computed } from 'vue-demi'
import type { MaybeRefDeep, DeepUnwrapRef, DistributiveOmit } from '../types.js'
import { type ToRefs, unref } from 'vue-demi'

export type UseMutationParameters<
  data = unknown,
  error = Error,
  variables = void,
  context = unknown,
> = Evaluate<
  MaybeRefDeep<
    Omit<
      DeepUnwrapRef<
        UseMutationOptions<data, error, Evaluate<variables>, context>
      >,
      'mutationFn' | 'mutationKey' | 'throwOnError'
    >
  >
>

type MutationResult<TData, TError, TVariables, TContext> = DistributiveOmit<
  MutationObserverResult<TData, TError, TVariables, TContext>,
  'mutate' | 'reset'
>
export type UseMutationReturnType<
  data = unknown,
  error = Error,
  variables = void,
  context = unknown,
  result = MutationResult<data, error, variables, context>,
> = Evaluate<
  ToRefs<Readonly<result>> & {
    reset: MutationObserverResult<data, error, variables, context>['reset']
  }
>

////////////////////////////////////////////////////////////////////////////////

export type UseQueryParameters<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = MaybeRefDeep<
  Evaluate<
    ExactPartial<
      Omit<
        DeepUnwrapRef<
          UseQueryOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>
        >,
        'queryKey' | 'initialData'
      >
    > & {
      // Fix `initialData` type
      initialData?:
        | DeepUnwrapRef<
            UseQueryOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>
          >['initialData']
        | undefined
    }
  > & {
    queryKey: TQueryKey
  }
>

export type UseQueryReturnType<data = unknown, error = DefaultError> = Evaluate<
  UQRT<data, error> & {
    queryKey: MaybeRefDeep<QueryKey>
  }
>

// Adding some basic customization.
// Ideally we don't have this function, but `import('@tanstack/react-query').useQuery` currently has some quirks where it is super hard to
// pass down the inferred `initialData` type because of it's discriminated overload in the on `useQuery`.
export function useQuery<
  TQueryFnData,
  TError,
  TData,
  TQueryData,
  TQueryKey extends QueryKey,
>(
  parameters: UseQueryParameters<
    TQueryFnData,
    TError,
    TData,
    TQueryData,
    TQueryKey
  >,
): UseQueryReturnType<TData, TError> {
  const options = computed(() => ({
    ...(unref(parameters) as any),
    queryKeyHashFn: hashFn, // for bigint support
  }))

  const result = tanstack_useQuery(options) as UseQueryReturnType<TData, TError>
  result.queryKey = unref(parameters).queryKey
  return result
}
