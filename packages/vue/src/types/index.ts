import type { Ref } from 'vue'

export type MaybeRef<T> = T | Ref<T>

export type DeepMaybeRef<T> = T extends Ref<infer V>
  ? MaybeRef<V>
  : T extends any[] | object
  ? { [K in keyof T]: DeepMaybeRef<T[K]> }
  : MaybeRef<T>
