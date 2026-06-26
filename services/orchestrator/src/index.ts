import { runWorker } from './worker.js'

async function main(): Promise<void> {
  const [, , command] = process.argv

  if ((command ?? 'worker') !== 'worker') {
    throw new Error(`Unsupported command: ${command}`)
  }

  await runWorker()
}

void main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('[orchestrator]', error)
  process.exit(1)
})

