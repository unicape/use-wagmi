import path from 'path'
import fs from 'fs-extra'
import consola from 'consola'
import { execSync as exec } from 'child_process'

const watch = process.argv.includes('--watch')

async function build () {
  consola.info('Clean up')
  exec('pnpm run clean', { stdio: 'inherit' })

  await fs.mkdir(path.join(__dirname, '..', 'dist'))
  await fs.copyFile(
    path.join(__dirname, '..' , 'package.json'),
    path.join(__dirname, '..', 'dist', 'package.json')
  )
  await fs.copyFile(
    path.join(__dirname, '..' , 'README.md'),
    path.join(__dirname, '..', 'dist', 'README.md')
  )

  consola.info('Rollup')
  exec(`pnpm run build:rollup${watch ? ' --watch' : ''}`, { stdio: 'inherit' })
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