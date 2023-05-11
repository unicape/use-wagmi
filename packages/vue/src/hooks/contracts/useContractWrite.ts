import { useMutation } from '@tanstack/vue-query'
import { writeContract } from '@wagmi/core'
import type {
  PrepareWriteContractResult,
  WriteContractMode,
  WriteContractResult,
  WriteContractUnpreparedArgs,
} from '@wagmi/core'
import { getSendTransactionParameters } from '@wagmi/core/internal'
import type { Abi } from 'abitype'
import type { GetFunctionArgs, SendTransactionParameters } from 'viem'
import type { UnwrapRef } from 'vue-demi'
import { computed, unref } from 'vue-demi'

import type { DeepMaybeRef, MutationConfig, PartialBy } from '../../types'

export type UseContractWritePreparedArgs<
  TAbi extends Abi | readonly unknown[] = Abi,
  TFunctionName extends string = string,
> = DeepMaybeRef<
  Partial<Pick<PrepareWriteContractResult<TAbi, TFunctionName>, 'request'>> & {
    abi?: never
    accessList?: never
    address?: never
    args?: never
    chainId?: never
    functionName?: never
    gas?: never
    gasPrice?: never
    maxFeePerGas?: never
    maxPriorityFeePerGas?: never
    nonce?: never
    value?: never
  }
>

type UseContractWriteUnpreparedArgs<
  TAbi extends Abi | readonly unknown[] = Abi,
  TFunctionName extends string = string,
> = DeepMaybeRef<
  PartialBy<
    Omit<WriteContractUnpreparedArgs<TAbi, TFunctionName>, 'args'>,
    'abi' | 'address' | 'functionName'
  > &
    Partial<GetFunctionArgs<TAbi, TFunctionName>> & {
      request?: never
    }
>

export type UseContractWriteArgs<
  TAbi extends Abi | readonly unknown[] = Abi,
  TFunctionName extends string = string,
  TMode extends WriteContractMode = undefined,
> = { mode?: TMode } & (TMode extends 'prepared'
  ? UseContractWritePreparedArgs<TAbi, TFunctionName>
  : UseContractWriteUnpreparedArgs<TAbi, TFunctionName>)

export type UseContractWriteConfig<
  TAbi extends Abi | readonly unknown[] = Abi,
  TFunctionName extends string = string,
  TMode extends WriteContractMode = undefined,
> = MutationConfig<
  WriteContractResult,
  Error,
  UseContractWriteArgs<TAbi, TFunctionName, TMode>
> &
  UseContractWriteArgs<TAbi, TFunctionName, TMode>

function mutationKey({
  address,
  abi,
  functionName,
  ...config
}: UseContractWriteArgs) {
  const {
    args,
    accessList,
    gas,
    gasPrice,
    maxFeePerGas,
    maxPriorityFeePerGas,
    nonce,
    request,
    value,
  } = config
  return [
    {
      entity: 'writeContract',
      address,
      args,
      abi,
      accessList,
      functionName,
      gas,
      gasPrice,
      maxFeePerGas,
      maxPriorityFeePerGas,
      nonce,
      request,
      value,
    },
  ] as const
}

function mutationFn(
  config: UnwrapRef<UseContractWriteArgs<Abi, string, WriteContractMode>>,
) {
  if (config.mode === 'prepared') {
    if (!config.request) throw new Error('request is required')
    return writeContract({
      mode: 'prepared',
      ...config.request,
    } as any)
  }

  if (!config.address) throw new Error('address is required')
  if (!config.abi) throw new Error('abi is required')
  if (!config.functionName) throw new Error('functionName is required')

  return writeContract({
    address: config.address,
    args: config.args as unknown[],
    chainId: config.chainId,
    abi: config.abi as Abi, // TODO: Remove cast and still support `Narrow<TAbi>`
    functionName: config.functionName,
    accessList: config.accessList,
    gas: config.gas,
    gasPrice: config.gasPrice,
    maxFeePerGas: config.maxFeePerGas,
    maxPriorityFeePerGas: config.maxPriorityFeePerGas,
    nonce: config.nonce,
    value: config.value,
  } as any)
}

/**
 * @description Hook for calling a contract nonpayable or payable function.
 *
 * It is highly recommended to pair this with the [`usePrepareContractWrite` hook](/docs/prepare-hooks/usePrepareContractWrite)
 * to [avoid UX pitfalls](https://wagmi.sh/react/prepare-hooks#ux-pitfalls-without-prepare-hooks).
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
export function useContractWrite<
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
>(config: UseContractWriteConfig<TAbi, TFunctionName, TMode>) {
  const { address, abi, args, chainId, functionName, mode, request } =
    config as any
  const {
    accessList,
    gas,
    gasPrice,
    maxFeePerGas,
    maxPriorityFeePerGas,
    nonce,
    value,
  } = getSendTransactionParameters(config as any)

  const {
    data,
    error,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    mutate,
    mutateAsync,
    reset,
    status,
    variables,
  } = useMutation(
    mutationKey({
      address,
      abi,
      functionName,
      chainId,
      mode,
      args,
      accessList,
      gas,
      gasPrice,
      maxFeePerGas,
      maxPriorityFeePerGas,
      nonce,
      request: request,
      value,
    } as UseContractWriteArgs),
    mutationFn,
    {
      onError: config.onError as UseContractWriteConfig['onError'] as any,
      onMutate: config.onMutate as UseContractWriteConfig['onMutate'] as any,
      onSettled: config.onSettled as UseContractWriteConfig['onSettled'] as any,
      onSuccess: config.onSuccess as UseContractWriteConfig['onSuccess'] as any,
    },
  )

  const write = computed(() => {
    if (unref(mode) === 'prepared') {
      if (!request) return undefined

      return mutate({
        mode: 'prepared',
        request: config.request,
        chainId: config.chainId,
      } as any)
    }

    return (overrideConfig?: MutationFnArgs<TAbi, TFunctionName>) =>
      mutate({
        address,
        args,
        abi: abi as Abi,
        functionName,
        chainId,
        accessList,
        gas,
        gasPrice,
        maxFeePerGas,
        maxPriorityFeePerGas,
        nonce,
        value,
        ...overrideConfig,
      } as any)
  }).value

  const writeAsync = computed(() => {
    if (unref(mode) === 'prepared') {
      if (!request) return undefined

      return mutateAsync({
        address,
        chainId,
        abi: abi as Abi,
        functionName,
        mode: 'prepared',
        request,
      } as MutationFnConfig)
    }

    return (overrideConfig?: MutationFnArgs<TAbi, TFunctionName>) =>
      mutateAsync({
        address,
        args:
          (overrideConfig?.recklesslySetUnpreparedArgs as readonly unknown[]) ??
          args,
        chainId,
        abi: abi as Abi,
        functionName,
        mode: 'recklesslyUnprepared',
        overrides:
          overrideConfig?.recklesslySetUnpreparedOverrides ?? overrides,
      } as MutationFnConfig)
  }).value

  return {
    data,
    error,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    reset,
    status,
    variables,
    write,
    writeAsync,
  }
}

type MutationFnArgs<
  TAbi extends Abi | readonly unknown[] = Abi,
  TFunctionName extends string = string,
> = {
  /**
   * Recklessly pass through unprepared config. Note: This has
   * [UX pitfalls](https://wagmi.sh/react/prepare-hooks/intro#ux-pitfalls-without-prepare-hooks),
   * it is highly recommended to not use this and instead prepare the config upfront
   * using the `usePrepareContractWrite` function.
   */
  recklesslySetUnpreparedArgs?: WriteContractUnpreparedArgs<
    TAbi,
    TFunctionName
  >['args']
  recklesslySetUnpreparedOverrides?: WriteContractUnpreparedArgs<
    TAbi,
    TFunctionName
  >['overrides']
}
