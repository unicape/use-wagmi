import type {
  QueryFunctionContext,
  UseInfiniteQueryOptions,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/vue-query'
import type { Ref, UnwrapRef } from 'vue-demi'

export type MaybeRef<T> = T | Ref<T>

export type ShallowMaybeRef<T> = {
  [K in keyof T]: T extends Ref<infer V> ? MaybeRef<V> : MaybeRef<T[K]>
}

export type DeepMaybeRef<T> = T extends Ref<infer V>
  ? MaybeRef<V>
  : T extends Array<any> | object
  ? { [K in keyof T]: DeepMaybeRef<T[K]> }
  : MaybeRef<T>

/**
 * Makes {@link TKeys} optional in {@link TType} while preserving type inference.
 */
// s/o trpc (https://github.com/trpc/trpc/blob/main/packages/server/src/types.ts#L6)
export type PartialBy<TType, TKeys extends keyof TType> = Partial<
  Pick<TType, TKeys>
> &
  Omit<TType, TKeys>

export type DeepPartial<
  T,
  MaxDepth extends number,
  Depth extends ReadonlyArray<number> = [],
> = Depth['length'] extends MaxDepth
  ? T
  : T extends object
  ? { [P in keyof T]?: DeepPartial<T[P], MaxDepth, [...Depth, 1]> }
  : T

export type QueryFunctionArgs<T extends (...args: any) => any> =
  QueryFunctionContext<ReturnType<T>>

export type QueryConfig<TData, TError, TSelectData = TData> = Pick<
  UseQueryOptions<TData, TError, TSelectData>,
  'cacheTime' | 'enabled' | 'staleTime' | 'structuralSharing' | 'suspense'
> & {
  /** Scope the cache to a given context. */
  scopeKey?: MaybeRef<string | undefined>
} & UnwrapRef<
    Pick<
      UseQueryOptions<TData, TError, TSelectData>,
      'onError' | 'onSettled' | 'onSuccess' | 'isDataEqual'
    >
  >

export type QueryConfigWithSelect<TData, TError, TSelectData = TData> = Pick<
  UseQueryOptions<TData, TError, TSelectData>,
  'cacheTime' | 'enabled' | 'staleTime' | 'structuralSharing' | 'suspense'
> & {
  /** Scope the cache to a given context. */
  scopeKey?: MaybeRef<string>
} & UnwrapRef<
    Pick<
      UseQueryOptions<TData, TError, TSelectData>,
      'onError' | 'onSettled' | 'onSuccess' | 'isDataEqual' | 'select'
    >
  >

export type InfiniteQueryConfig<TData, TError, TSelectData = TData> = Pick<
  UseInfiniteQueryOptions<TData, TError, TSelectData>,
  | 'cacheTime'
  | 'enabled'
  | 'keepPreviousData'
  | 'staleTime'
  | 'structuralSharing'
  | 'suspense'
> & {
  /** Scope the cache to a given context. */
  scopeKey?: MaybeRef<string>
} & UnwrapRef<
    Pick<
      UseInfiniteQueryOptions<TData, TError, TSelectData>,
      | 'onError'
      | 'onSettled'
      | 'onSuccess'
      | 'isDataEqual'
      | 'getNextPageParam'
      | 'select'
    >
  >

export type MutationConfig<
  Data,
  Error,
  Variables = void,
  TContext = unknown,
> = {
  /** Function fires if mutation encounters error */
  onError?: UseMutationOptions<Data, Error, Variables, TContext>['onError']
  /**
   * Function fires before mutation function and is passed same variables mutation function would receive.
   * Value returned from this function will be passed to both onError and onSettled functions in event of a mutation failure.
   */
  onMutate?: UseMutationOptions<Data, Error, Variables, TContext>['onMutate']
  /** Function fires when mutation is either successfully fetched or encounters error */
  onSettled?: UseMutationOptions<Data, Error, Variables, TContext>['onSettled']
  /** Function fires when mutation is successful and will be passed the mutation's result */
  onSuccess?: UseMutationOptions<Data, Error, Variables, TContext>['onSuccess']
}
