const secrets = require('../secrets.js')

const NAME = 'Governance'
const SYMBOL = 'SGOV'
const INITIAL_SUPPLY = 1000000
const OWNER = secrets.owner

module.exports = {
  INITIAL_SUPPLY,
  NAME,
  OWNER,
  SYMBOL
}
