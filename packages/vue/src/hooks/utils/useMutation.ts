import { isRef, unref } from 'vue-demi'
import type { UnwrapRef } from 'vue-demi'
import { useMutation as useMutation_ } from 'vue-query'

import type {
  MutationFunction,
  MutationKey,
  UseMutationOptions,
} from 'vue-query'

import { useQueryClient } from './useQueryClient'

function cloneDeep<T>(
  value: T,
  customizer?: (val: unknown) => unknown | void,
): T {
  if (customizer) {
    const result = customizer(value)
    if (result !== undefined || isRef(value)) {
      return result as typeof value
    }
  }

  if (Array.isArray(value)) {
    return value.map((val) => cloneDeep(val, customizer)) as typeof value
  }

  if (typeof value === 'object' && isPlainObject(value)) {
    const entries = Object.entries(value).map(([key, val]) => [
      key,
      cloneDeep(val, customizer),
    ])
    return Object.fromEntries(entries)
  }

  return value
}

function cloneDeepUnref<T>(obj: T): UnwrapRef<T> {
  return cloneDeep(obj, (val) => {
    if (isRef(val)) {
      return cloneDeepUnref(unref(val))
    }
  }) as UnwrapRef<typeof obj>
}

function isPlainObject(value: unknown): value is object {
  if (Object.prototype.toString.call(value) !== '[object Object]') {
    return false
  }

  const prototype = Object.getPrototypeOf(value)
  return prototype === null || prototype === Object.prototype
}

export function useMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown,
>(
  mutationKey: MutationKey,
  mutationFn_: MutationFunction<TData, TVariables>,
  options: UseMutationOptions<TData, TError, TVariables, TContext>,
) {
  const queryClient = useQueryClient()
  const mutationFn = (args_: TVariables) => {
    const args = cloneDeepUnref(args_) as TVariables
    return mutationFn_(args)
  }
  return useMutation_({
    mutationKey,
    mutationFn,
    ...options,
    queryClient,
  })
}
