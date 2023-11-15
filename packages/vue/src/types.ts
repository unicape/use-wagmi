import type { Ref, UnwrapRef } from 'vue'
import type { DefaultError, QueryKey } from '@tanstack/vue-query'
import type { Config } from '@wagmi/core'

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

export type WithRequired<T, K extends keyof T> = T & {
  [_ in K]: {}
}

export type MaybeRef<T> = T | Ref<T>

export type MaybeRefOrGetter<T> = MaybeRef<T> | (() => T)

export type DeepMaybeRef<T> = T extends Ref<infer V>
  ? MaybeRef<V>
  : T extends any[] | object
  ? { [K in keyof T]: DeepMaybeRef<T[K]> }
  : MaybeRef<T>

export type DeepUnwrapRef<T> = T extends UnwrapLeaf
  ? T
  : T extends Ref<infer U>
  ? DeepUnwrapRef<U>
  : T extends {}
  ? {
      [Property in keyof T]: DeepUnwrapRef<T[Property]>
    }
  : UnwrapRef<T>

export type EnabledParameter = {
  enabled?: boolean | undefined
}

export type ConfigParameter<config extends Config = Config> = {
  config?: Config | config | undefined
}

export type QueryParameter<
  queryFnData = unknown,
  error = DefaultError,
  data = queryFnData,
  queryKey extends QueryKey = QueryKey,
> = {
  query?: UseQueryParameters<queryFnData, error, data, queryKey> | undefined
}
