import { useClient } from '../../client'

export function useQueryClient() {
  return useClient().queryClient
}
