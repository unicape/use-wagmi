import { writeContract } from '@wagmi/core'

import type {
  WriteContractMode,
  WriteContractPreparedArgs,
  WriteContractResult,
  WriteContractUnpreparedArgs,
} from '@wagmi/core'
import type { Abi } from 'abitype'
import type { UnwrapRef } from 'vue-demi'
import { computed, unref } from 'vue-demi'

import type { DeepMaybeRef, MutationConfig, PartialBy } from '../../types'
import { useMutation } from '../utils'

export type UseContractWriteArgs<
  TMode extends WriteContractMode = WriteContractMode,
  TAbi extends Abi | readonly unknown[] = Abi,
  TFunctionName extends string = string,
> = { mode: TMode } & (
  | PartialBy<
      DeepMaybeRef<WriteContractPreparedArgs<TAbi, TFunctionName>>,
      'abi' | 'address' | 'functionName' | 'request'
    >
  | PartialBy<
      DeepMaybeRef<WriteContractUnpreparedArgs<TAbi, TFunctionName>>,
      'abi' | 'address' | 'args' | 'functionName'
    >
)

export type UseContractWriteConfig<
  TMode extends WriteContractMode = WriteContractMode,
  TAbi extends Abi | readonly unknown[] = Abi,
  TFunctionName extends string = string,
> = MutationConfig<
  WriteContractResult,
  Error,
  UseContractWriteArgs<TMode, TAbi, TFunctionName>
> &
  UseContractWriteArgs<TMode, TAbi, TFunctionName>

type MutationKeyConfig = UseContractWriteArgs
type MutationFnConfig = UnwrapRef<
  UseContractWriteArgs<WriteContractMode, Abi, string>
> & {
  args?: readonly unknown[]
  overrides: WriteContractUnpreparedArgs<Abi, string>['overrides']
}

function mutationKey({
  address,
  chainId,
  abi,
  functionName,
  ...config
}: MutationKeyConfig) {
  const { request } = config as DeepMaybeRef<
    WriteContractPreparedArgs<Abi, string>
  >
  const { args, overrides } = config as unknown as DeepMaybeRef<
    WriteContractUnpreparedArgs<Abi, string>
  >
  return [
    {
      entity: 'writeContract',
      address,
      args,
      chainId,
      abi,
      functionName,
      overrides,
      request,
    },
  ] as const
}

function mutationFn(config: MutationFnConfig) {
  const { address, abi, functionName, chainId, mode, overrides, args } = config
  const { request } = config as WriteContractPreparedArgs<Abi, string>
  if (!address) throw new Error('address is required')
  if (!abi) throw new Error('abi is required')
  if (!functionName) throw new Error('functionName is required')

  switch (mode) {
    case 'prepared': {
      if (!request) throw new Error('request is required')
      return writeContract({
        mode: 'prepared',
        address,
        chainId,
        abi: config.abi as Abi, // TODO: Remove cast and still support `Narrow<TAbi>`
        functionName,
        request,
      })
    }
    case 'recklesslyUnprepared':
      return writeContract({
        address,
        args,
        chainId,
        abi: config.abi as Abi, // TODO: Remove cast and still support `Narrow<TAbi>`
        functionName,
        mode: 'recklesslyUnprepared',
        overrides,
      })
  }
}

/**
 * @description Hook for calling an ethers Contract [write](https://docs.ethers.io/v5/api/contract/contract/#Contract--write)
 * method.
 *
 * It is highly recommended to pair this with the [`usePrepareContractWrite` hook](/docs/prepare-hooks/usePrepareContractWrite)
 * to [avoid UX pitfalls](https://wagmi.sh/react/prepare-hooks#ux-pitfalls-without-prepare-hooks).
 *
 * @example
 * import { useContractWrite, usePrepareContractWrite } from 'wagmi'
 *
 * const { config } = usePrepareContractWrite({
 *  address: '0xecb504d39723b0be0e3a9aa33d646642d1051ee1',
 *  abi: wagmigotchiABI,
 *  functionName: 'feed',
 * })
 * const { data, isLoading, isSuccess, write } = useContractWrite(config)
 */
export function useContractWrite<
  TMode extends WriteContractMode,
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends string,
>(config: UseContractWriteConfig<TMode, TAbi, TFunctionName> = {} as any) {
  const { address, abi, functionName, chainId, mode } = config
  const { request } = config as DeepMaybeRef<
    WriteContractPreparedArgs<TAbi, TFunctionName>
  >
  const { args, overrides } = config as unknown as DeepMaybeRef<
    WriteContractUnpreparedArgs<TAbi, TFunctionName>
  >

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
      overrides,
      request,
    } as UseContractWriteArgs),
    mutationFn,
    {
      onError: config.onError as UseContractWriteConfig['onError'],
      onMutate: config.onMutate as UseContractWriteConfig['onMutate'],
      onSettled: config.onSettled as UseContractWriteConfig['onSettled'],
      onSuccess: config.onSuccess as UseContractWriteConfig['onSuccess'],
    },
  )

  const write = () => {
    return computed(() => {
      if (unref(mode) === 'prepared') {
        if (!request) return undefined

        return mutate({
          address,
          chainId,
          abi: abi as Abi,
          functionName,
          mode: 'prepared',
          request,
        } as MutationFnConfig)
      }

      return (overrideConfig?: MutationFnArgs<TAbi, TFunctionName>) =>
        mutate({
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
  }

  const writeAsync = () => {
    return computed(() => {
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
  }

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
