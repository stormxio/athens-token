const { deployProxy } = require('@openzeppelin/truffle-upgrades')

const Governance = artifacts.require('Governance')

module.exports = async function (deployer, network, accounts) {
  const name = 'Governance'
  const symbol = 'SGOV'
  const initialSupply = 1000000
  const owner = accounts[0]

  await deployProxy(Governance, [name, symbol, initialSupply, owner], {
    deployer,
    initializer: 'initialize',
  })
}
