import { program } from 'commander'
import fs from 'fs'

import { parseBalanceMap } from './helpers/parse-balance-map'

program
  .requiredOption(
    '-i, --input <path>',
    'input JSON file location containing a map of account addresses to string balances'
  )

program.parse(process.argv)

const options = program.opts()

try {
  const input = fs.readFileSync(options.input, 'utf8')
  const json = JSON.parse(input)
  const tree = parseBalanceMap(json)
  process.stdout.write(JSON.stringify(tree))
} catch (err) {
  console.error(err)
  process.exit(1)
}
