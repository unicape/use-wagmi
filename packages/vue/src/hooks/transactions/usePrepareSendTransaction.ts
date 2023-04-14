import { prepareSendTransaction } from '@wagmi/core'
import type {
  FetchSignerResult,
  PrepareSendTransactionArgs,
  PrepareSendTransactionResult,
} from '@wagmi/core'
import type { providers } from 'ethers'
import { computed, unref } from 'vue-demi'
import type { UnwrapRef } from 'vue-demi'

import type { DeepMaybeRef, QueryConfig, QueryFunctionArgs } from '../../types'
import { useNetwork, useSigner } from '../accounts'
import { useQuery } from '../utils'

export type UsePrepareSendTransactionArgs = DeepMaybeRef<
  Partial<PrepareSendTransactionArgs>
>
export type UsePrepareSendTransactionConfig = QueryConfig<
  PrepareSendTransactionResult,
  Error
>

type QueryKeyArgs = UsePrepareSendTransactionArgs
type QueryKeyConfig = Pick<UsePrepareSendTransactionConfig, 'scopeKey'> &
  DeepMaybeRef<{
    activeChainId?: number
    signerAddress?: string
  }>

function queryKey({
  activeChainId,
  chainId,
  request,
  scopeKey,
  signerAddress,
}: QueryKeyArgs & QueryKeyConfig) {
  return [
    {
      entity: 'prepareSendTransaction',
      activeChainId,
      chainId,
      request,
      scopeKey,
      signerAddress,
    },
  ] as const
}

function queryFn({ signer }: { signer?: FetchSignerResult }) {
  return ({
    queryKey: [{ chainId, request }],
  }: UnwrapRef<QueryFunctionArgs<typeof queryKey>>) => {
    if (!request?.to) throw new Error('request.to is required')
    return prepareSendTransaction({
      chainId,
      request: { ...request, to: request.to },
      signer,
    } as PrepareSendTransactionArgs)
  }
}

/**
 * @description Hook for preparing a transaction to be sent via [`useSendTransaction`](/docs/hooks/useSendTransaction).
 *
 * Eagerly fetches the parameters required for sending a transaction such as the gas estimate and resolving an ENS address (if required).
 *
 * @example
 * import { useSendTransaction, usePrepareSendTransaction } from 'use-wagmi'
 *
 * const { config } = usePrepareSendTransaction({
 *   to: 'moxey.eth',
 *   value: parseEther('1'),
 * })
 * const result = useSendTransaction(config)
 */
export function usePrepareSendTransaction({
  chainId,
  request,
  cacheTime,
  enabled = true,
  scopeKey,
  staleTime = 1_000 * 60 * 60 * 24, // 24 hours
  suspense,
  onError,
  onSettled,
  onSuccess,
}: UsePrepareSendTransactionArgs & UsePrepareSendTransactionConfig = {}) {
  const { chain: activeChain } = useNetwork()
  const { data: signer } = useSigner<providers.JsonRpcSigner>({ chainId })

  const activeChainId = computed(() => activeChain?.value?.id)
  const signerAddress = computed(() => signer.value?._address)
  const prepareSendTransactionQuery = useQuery(
    queryKey({
      activeChainId,
      chainId,
      request,
      scopeKey,
      signerAddress,
    }),
    queryFn({ signer: signer.value }),
    {
      cacheTime,
      enabled: computed(
        () =>
          !!(
            unref(enabled) &&
            unref(signer) &&
            unref(request) &&
            unref(request)?.to
          ),
      ),
      staleTime,
      suspense,
      onError,
      onSettled,
      onSuccess,
    },
  )

  return Object.assign(prepareSendTransactionQuery, {
    config: {
      request: undefined,
      mode: 'prepared',
      ...prepareSendTransactionQuery.data.value,
    } as PrepareSendTransactionResult,
  })
}
