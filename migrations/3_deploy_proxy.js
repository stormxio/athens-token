const { deployProxy } = require('@openzeppelin/truffle-upgrades')

const secrets = require('../secrets.js')

const Governance = artifacts.require('Governance')

module.exports = async function (deployer) {
  const name = 'Governance'
  const symbol = 'SGOV'
  const initialSupply = 1000000
  const owner = secrets.owner

  await deployProxy(Governance, [name, symbol, initialSupply, owner], {
    deployer,
    initializer: 'initialize',
  })
}
