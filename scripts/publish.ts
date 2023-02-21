import path from 'path'
import { execSync } from 'child_process'
import consola from 'consola'

execSync('npm run build', { stdio: 'inherit' })

const command = 'npm publish'

execSync(command, { stdio: 'inherit', cwd: path.join('dist') })
consola.success(`Published use-wagmi!`)