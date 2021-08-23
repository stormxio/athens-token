const { BN } = require('@openzeppelin/test-helpers')
const { expect } = require('chai')

const expectBN = (result, expected) => expect(result).to.be.bignumber.equal(new BN(expected))

const expectEqual = (result, expected) => expect(result).to.equal(expected)

module.exports = {
  expectBN,
  expectEqual,
}
