import { useQueryClient as useQueryClient_ } from 'vue-query'

import { queryClientKey } from '../../context'

export function useQueryClient() {
  return useQueryClient_(queryClientKey)
}
