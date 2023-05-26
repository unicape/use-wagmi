import { isRef, unref } from 'vue-demi'
import type { UnwrapRef } from 'vue-demi'

export function updateState(
  state: Record<string, unknown>,
  update: Record<string, any>,
): void {
  Object.keys(state).forEach((key) => {
    state[key] = update[key]
  })
}

export function cloneDeep<T>(
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
    const entries = Object.entries(value as object).map(([key, val]) => [
      key,
      cloneDeep(val, customizer),
    ])
    return Object.fromEntries(entries)
  }

  return value
}

export function cloneDeepUnref<T>(obj: T): UnwrapRef<T> {
  return cloneDeep(obj, (val) => {
    if (isRef(val)) {
      return cloneDeepUnref(unref(val))
    }
  }) as UnwrapRef<typeof obj>
}

export function isPlainObject(value: unknown): value is unknown {
  if (Object.prototype.toString.call(value) !== '[object Object]') {
    return false
  }

  const prototype = Object.getPrototypeOf(value)
  return prototype === null || prototype === Object.prototype
}
