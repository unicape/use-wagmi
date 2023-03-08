import { WagmiQueryClientKey } from '../create'
import { useQueryClient as useQueryClient_ } from 'vue-query'

export function useQueryClient () {
  return useQueryClient_(WagmiQueryClientKey)
}