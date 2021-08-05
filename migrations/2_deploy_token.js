const Governance = artifacts.require('Governance')

module.exports = async function (deployer) {
  await deployer.deploy(Governance)
}
