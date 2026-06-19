import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const root = path.dirname(fileURLToPath(import.meta.url))
const packages = path.resolve(root, '../../packages')

export default defineConfig({
  server: {
    port: 3000,
    allowedHosts: ['krypton.chessonchain.online', 'krypton-dev.chessonchain.online'],
  },
  resolve: {
    tsconfigPaths: true,
    alias: {
      '@krypton/ui': path.join(packages, 'ui/src/index.tsx'),
      '@krypton/sdk': path.join(packages, 'sdk/src/index.ts'),
      '@krypton/policy-schema': path.join(packages, 'policy-schema/src/index.ts'),
    },
  },
  ssr: {
    noExternal: ['@krypton/ui', '@krypton/sdk', '@krypton/policy-schema'],
  },
  plugins: [
    tailwindcss(),
    tanstackStart({
      srcDirectory: 'src',
    }),
    viteReact(),
  ],
})
