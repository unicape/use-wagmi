import { prepareWriteContract } from '@wagmi/core'

import type {
  PrepareWriteContractConfig,
  PrepareWriteContractResult,
} from '@wagmi/core'
import type { Abi } from 'abitype'
import type { providers } from 'ethers'
import { computed, unref } from 'vue-demi'
import type { UnwrapRef } from 'vue-demi'

import type {
  DeepMaybeRef,
  PartialBy,
  QueryConfig,
  QueryFunctionArgs,
} from '../../types'
import { useNetwork } from '../accounts'
import { useQuery } from '../utils'

export type UsePrepareContractWriteConfig<
  TAbi extends Abi | readonly unknown[] = Abi,
  TFunctionName extends string = string,
  TChainId extends number = number,
  TSigner extends Signer = Signer,
> = PartialBy<
  DeepMaybeRef<
    PrepareWriteContractConfig<TAbi, TFunctionName, TChainId, TSigner>
  >,
  'abi' | 'address' | 'args' | 'functionName'
> &
  QueryConfig<PrepareWriteContractResult<TAbi, TFunctionName, TChainId>, Error>

type QueryKeyArgs = DeepMaybeRef<Omit<PrepareWriteContractConfig, 'abi'>>
type QueryKeyConfig = DeepMaybeRef<
  Pick<UsePrepareContractWriteConfig, 'scopeKey'> & {
    activeChainId?: number
    signerAddress?: string
  }
>

function queryKey({
  activeChainId,
  args,
  address,
  chainId,
  functionName,
  overrides,
  signerAddress,
}: QueryKeyArgs & QueryKeyConfig) {
  return [
    {
      entity: 'prepareContractTransaction',
      activeChainId,
      address,
      args,
      chainId,
      functionName,
      overrides,
      signerAddress,
    },
  ] as const
}

function queryFn({
  abi,
  signer,
}: {
  abi?: Abi | readonly unknown[]
  signer?: FetchSignerResult
}) {
  return ({
    queryKey: [{ args, address, chainId, functionName, overrides }],
  }: UnwrapRef<QueryFunctionArgs<typeof queryKey>>) => {
    if (!abi) throw new Error('abi is required')
    return prepareWriteContract({
      // TODO: Remove cast and still support `Narrow<TAbi>`
      abi: abi as Abi,
      args,
      address,
      chainId,
      functionName,
      overrides: overrides as PrepareWriteContractConfig['overrides'],
      signer,
    })
  }
}

/**
 * @description Hook for preparing a contract write to be sent via [`useContractWrite`](/docs/hooks/useContractWrite).
 *
 * Eagerly fetches the parameters required for sending a contract write transaction such as the gas estimate.
 *
 * @example
 * import { useContractWrite, usePrepareContractWrite } from 'use-wagmi'
 *
 * const { config } = usePrepareContractWrite({
 *  address: '0xecb504d39723b0be0e3a9aa33d646642d1051ee1',
 *  abi: wagmigotchiABI,
 *  functionName: 'feed',
 * })
 * const { data, isLoading, isSuccess, write } = useContractWrite(config)
 *
 */
export function usePrepareContractWrite<
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends string,
  TChainId extends number,
>(
  {
    address,
    abi,
    functionName,
    chainId,
    args,
    overrides,
    cacheTime,
    enabled = true,
    scopeKey,
    staleTime,
    suspense,
    onError,
    onSettled,
    onSuccess,
  }: UsePrepareContractWriteConfig<TAbi, TFunctionName, TChainId> = {} as any,
) {
  const { chain: activeChain } = useNetwork()
  const { data: signer } = useSigner<providers.JsonRpcSigner>({ chainId })

  const prepareContractWriteQuery = useQuery(
    queryKey({
      activeChainId: activeChain?.value?.id,
      address,
      args,
      chainId,
      functionName,
      scopeKey,
      signerAddress: signer.value?._address,
      overrides,
    } as Omit<PrepareWriteContractConfig, 'abi'>),
    queryFn({
      // TODO: Remove cast and still support `Narrow<TAbi>`
      abi: unref(abi) as Abi,
      signer: signer.value,
    }),
    {
      cacheTime,
      enabled: computed(
        () =>
          !!(
            unref(enabled) &&
            unref(abi) &&
            unref(address) &&
            unref(functionName) &&
            unref(signer)
          ),
      ),
      staleTime,
      suspense,
      onError,
      onSettled,
      onSuccess,
    },
  )

  return Object.assign(prepareContractWriteQuery, {
    config: {
      abi,
      address,
      args,
      chainId,
      functionName,
      mode: 'prepared',
      overrides,
      request: undefined,
      ...prepareContractWriteQuery.data,
    },
  }) as unknown as DeepMaybeRef<
    PrepareWriteContractResult<TAbi, TFunctionName, TChainId>
  >
}
