import { unref, isRef } from 'vue-demi'
import type { MaybeRefDeep } from '../types.js'
import { cloneDeep } from './cloneDeep.js'

export function isPlainObject(obj: any) {
  return toString.call(obj) === '[object Object]'
}

export function cloneDeepUnref<T>(obj: MaybeRefDeep<T>): T {
  return cloneDeep(obj, (val) => {
    if (isRef(val)) {
      return cloneDeepUnref(unref(val))
    }

    return undefined
  })
}
