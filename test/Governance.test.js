const { BN } = require('@openzeppelin/test-helpers')
const { expect } = require('chai')

const secrets = require('../secrets.js')

const Governance = artifacts.require('Governance')

contract('Governance', function () {
  const name = 'Governance'
  const symbol = 'SGOV'
  const initialSupply = 1000000
  const owner = secrets.owner

  beforeEach(async function () {
    this.governance = await Governance.new()
    await this.governance.initialize(name, symbol, initialSupply, owner)
  })

  it('should have correct name', async function () {
    expect(await this.governance.name(), name)
  })

  it('should have correct symbol', async function () {
    expect(await this.governance.symbol(), symbol)
  })

  it('should have correct number of decimals', async function () {
    expect(await this.governance.decimals(), 18)
  })

  it('should have correct total supply', async function () {
    expect(await this.governance.totalSupply(), initialSupply)
  })

  it('owner should receive full initial supply', async function () {
    const ownerBalance = await this.governance.balanceOf(owner)
    expect(ownerBalance).to.be.bignumber.equal(new BN(initialSupply))
  })
})
