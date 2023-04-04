import { useQueryClient as useQueryClient_ } from 'vue-query'
import { WagmiQueryClientKey } from '../../create'

export function useQueryClient () {
  return useQueryClient_(WagmiQueryClientKey)
}