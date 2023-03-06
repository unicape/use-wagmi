import type { Ref } from 'vue-demi'
import type { UseMutationOptions, UseQueryOptions } from 'vue-query'

declare type MaybeRef<T> = T | Ref<T>

type IgnoreMaybeRef = 'onError' | 'onSettled' | 'onSuccess' | 'onBeforeConnect' | 'onConnect'

export type SetMaybeRef<T extends object> = {
  [KeyType in keyof T]: KeyType extends IgnoreMaybeRef ? T[KeyType] : MaybeRef<T[KeyType]>
}

export type QueryConfig<TData, TError, TSelectData = TData> = Pick<
  UseQueryOptions<TData, TError, TSelectData>,
  | 'cacheTime'
  | 'enabled'
  | 'isDataEqual'
  | 'keepPreviousData'
  | 'select'
  | 'staleTime'
  | 'structuralSharing'
  | 'suspense'
  | 'onError'
  | 'onSettled'
  | 'onSuccess'
> & {
  /** Scope the cache to a given context. */
  scopeKey?: string
}

export type MutationConfig<Data, Error, Variables = void> = {
  /** Function fires if mutation encounters error */
  onError?: UseMutationOptions<Data, Error, Variables, unknown>['onError']
  /**
   * Function fires before mutation function and is passed same variables mutation function would receive.
   * Value returned from this function will be passed to both onError and onSettled functions in event of a mutation failure.
   */
  onMutate?: UseMutationOptions<Data, Error, Variables, unknown>['onMutate']
  /** Function fires when mutation is either successfully fetched or encounters error */
  onSettled?: UseMutationOptions<Data, Error, Variables, unknown>['onSettled']
  /** Function fires when mutation is successful and will be passed the mutation's result */
  onSuccess?: UseMutationOptions<Data, Error, Variables, unknown>['onSuccess']
}
