import path from 'path'
import fs from 'fs-extra'
import consola from 'consola'
import { execSync as exec } from 'child_process'

const watch = process.argv.includes('--watch')

async function build () {
  consola.info('Clean up')
  exec('pnpm run clean', { stdio: 'inherit' })

  consola.info('Rollup')
  exec(`pnpm run build:rollup${watch ? ' --watch' : ''}`, { stdio: 'inherit' })

  await fs.copyFile(
    path.join(__dirname, '..' , 'package.json'),
    path.join(__dirname, '..', 'dist', 'package.json')
  )
}

async function cli() {
  try {
    await build()
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

cli()