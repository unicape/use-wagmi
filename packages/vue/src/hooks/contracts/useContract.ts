import { unref, computed } from 'vue-demi'

import type { Abi } from 'abitype'
import type { GetContractArgs } from '@wagmi/core'
import type { DeepMaybeRef, MaybeRef } from '../../types'

import { getContract } from '@wagmi/core'

export type UseContractConfig<TAbi extends Abi | readonly unknown[] = Abi> =
  DeepMaybeRef<Partial<Pick<GetContractArgs<TAbi>, 'abi' | 'address'>> & {
    /** Signer or provider to attach to contract */
    signerOrProvider?: MaybeRef<GetContractArgs['signerOrProvider'] | null>
  }>

  export function useContract<TAbi extends Abi | readonly unknown[]> ({
    address,
    abi,
    signerOrProvider
  }: UseContractConfig<TAbi> = {}) {
    return computed(() => {
      if (!unref(address) || !unref(abi)) return null
      return getContract({
        address: unref(address),
        abi: unref(abi),
        signerOrProvider:
          signerOrProvider === null ? undefined : unref(signerOrProvider)
      } as GetContractArgs)
    })
  }