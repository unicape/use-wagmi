import { type UnwrapNestedRefs, unref } from 'vue'
import type { MaybeRef } from '../types/index.js'

export function isPlainObject(obj: any) {
  return toString.call(obj) === '[object Object]'
}

export function deepUnref<T>(maybeRef: MaybeRef<T>): UnwrapNestedRefs<T> {
  const value = unref(maybeRef)

  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value as any).map(([k, v]) => [k, deepUnref(v)]),
    ) as any
  }

  if (Array.isArray(value)) return value.map((item) => deepUnref(item)) as any

  return value as any
}