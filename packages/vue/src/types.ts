import type { Ref, UnwrapRef } from 'vue-demi'
import type { DefaultError, QueryKey, MutateOptions } from '@tanstack/vue-query'
import type { Config } from '@wagmi/core'
import type { Evaluate } from '@wagmi/core/internal'

import type { UseQueryParameters } from './utils/query.js'

type Primitive = string | number | boolean | bigint | symbol | undefined | null
type UnwrapLeaf =
  | Primitive
  | Function
  | Date
  | Error
  | RegExp
  | Map<any, any>
  | WeakMap<any, any>
  | Set<any>
  | WeakSet<any>

export type MaybeRef<T> = Ref<T> | T

export type MaybeRefOrGetter<T> = MaybeRef<T> | (() => T)

export type MaybeRefShallow<T> = T extends object
  ? {
      [Property in keyof T]: MaybeRef<T[Property]>
    }
  : T

export type MaybeRefDeep<T> = MaybeRef<
  T extends Function | Config
    ? T
    : T extends object | any[]
    ? {
        [Property in keyof T]: MaybeRefDeep<T[Property]>
      }
    : T
>

export type ShallowUnwrapRef<T> = T extends Ref<infer P> ? P : T

export type DeepUnwrapRef<T> = T extends UnwrapLeaf
  ? T
  : T extends Ref<infer U>
  ? DeepUnwrapRef<U>
  : T extends {}
  ? {
      [Property in keyof T]: DeepUnwrapRef<T[Property]>
    }
  : UnwrapRef<T>

export type DistributiveOmit<T, K extends keyof any> = T extends any
  ? Omit<T, K>
  : never

export type EnabledParameter = {
  enabled?: boolean | undefined
}

export type ConfigParameter<config extends Config = Config> = {
  config?: Config | config | undefined
}

export type QueryParameter<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = {
  query?:
    | Omit<
        DeepUnwrapRef<
          UseQueryParameters<TQueryFnData, TError, TData, TQueryData, TQueryKey>
        >,
        'queryFn' | 'queryHash' | 'queryKey' | 'queryKeyHashFn' | 'throwOnError'
      >
    | undefined
}

export type Mutate<
  data = unknown,
  error = unknown,
  variables = void,
  context = unknown,
> = (
  ...args: Parameters<MutateFn<data, error, Evaluate<variables>, context>>
) => void

export type MutateAsync<
  data = unknown,
  error = unknown,
  variables = void,
  context = unknown,
> = MutateFn<data, error, Evaluate<variables>, context>

type MutateFn<
  data = unknown,
  error = unknown,
  variables = void,
  context = unknown,
> = undefined extends variables
  ? (
      variables?: variables,
      options?:
        | Evaluate<MutateOptions<data, error, variables, context>>
        | undefined,
    ) => Promise<data>
  : (
      variables: variables,
      options?:
        | Evaluate<MutateOptions<data, error, variables, context>>
        | undefined,
    ) => Promise<data>
