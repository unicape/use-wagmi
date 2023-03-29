interface PackageManifest {
  name: string
  build?: boolean
  external?: string[]
  iife?: boolean
  cjs?: boolean
  mjs?: boolean
  dts?: boolean
}

export const packages: PackageManifest[] = [
  { name: '.' },
  { name: 'actions' },
  {
    name: 'connectors',
    external: [
      '@wagmi/core/connectors/injected',
      '@wagmi/core/connectors/metaMask',
      '@wagmi/core/connectors/walletConnect',
      '@wagmi/core/connectors/coinbaseWallet',
      '@wagmi/core/connectors/ledger',
      '@wagmi/core/connectors/mock',
      '@wagmi/core/connectors/safe'
    ]
  },
  {
    name: 'hooks',
    external: [
      '@wagmi/core/internal'
    ]
  },
  {
    name: 'providers',
    external: [
      '@wagmi/core/providers/alchemy',
      '@wagmi/core/providers/infura',
      '@wagmi/core/providers/jsonRpc',
      '@wagmi/core/providers/public'
    ]
  },
  {
    name: 'chains',
    external: [
      '@wagmi/core/chains'
    ]
  },
]