export * from './core'
export * from './chains'
export * from './actions'
export * from './providers'
export * from './connectors'

export { createWagmi, getWagmi } from './create'
export type { CreateWagmiConfig, WagmiClient } from './create'

/* Constants */
export { erc20ABI, erc721ABI, erc4626ABI, units } from '@wagmi/core'

/* Storage */
export { createStorage, noopStorage } from '@wagmi/core'
export type { Storage } from '@wagmi/core'

/* Utils */
export {
  configureChains,
  deepEqual,
  deserialize,
  minimizeContractInterface,
  normalizeChainId,
  parseContractResult,
  serialize,
} from '@wagmi/core'
export type { ConfigureChainsConfig } from '@wagmi/core'

/* Types */
export type {
  ChainProviderFn,
  FallbackProviderConfig,
  Hash,
  ProviderWithFallbackConfig,
  Provider,
  Signer,
  Unit,
  WebSocketProvider,
} from '@wagmi/core'

export type { Ethereum } from '@wagmi/core'
export type { Address } from '@wagmi/core'

/* Error */
export {
  AddChainError,
  ChainDoesNotSupportMulticallError,
  ChainMismatchError,
  ChainNotConfiguredError,
  ConnectorAlreadyConnectedError,
  ConnectorNotFoundError,
  ContractMethodDoesNotExistError,
  ContractMethodNoResultError,
  ContractMethodRevertedError,
  ContractResultDecodeError,
  ProviderRpcError,
  ResourceUnavailableError,
  RpcError,
  SwitchChainError,
  SwitchChainNotSupportedError,
  UserRejectedRequestError
} from '@wagmi/core'