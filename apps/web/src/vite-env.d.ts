/// <reference types="vite/client" />

declare module '*.css?url' {
  const content: string
  export default content
}

interface ImportMetaEnv {
  readonly VITE_SOLANA_CLUSTER: string
  readonly VITE_SOLANA_RPC_URL: string
  readonly VITE_KRYPTON_PROGRAM_ID: string
  readonly VITE_DYNAMIC_ENVIRONMENT_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
