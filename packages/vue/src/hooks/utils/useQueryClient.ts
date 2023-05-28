import { useConfig } from '../../plugin'

export const useQueryClient = () => useConfig().value.queryClient
