import type { InjectionKey } from 'vue-demi'

export function createInjectionKey<T>(key: string): InjectionKey<T> {
  return key as any
}
