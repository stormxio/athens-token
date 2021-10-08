import { ethers, upgrades } from 'hardhat'

async function main() {
  const NAME = 'Governance'
  const SYMBOL = 'SGOV'
  const INITIAL_SUPPLY = 1_000_000
  const [OWNER] = await ethers.getSigners()

  console.info(`Deploying "${NAME}" [${SYMBOL}] with initial supply of ${INITIAL_SUPPLY} and owner ${OWNER.address}...`)

  const Governance = await ethers.getContractFactory('Governance')
  const token = await upgrades.deployProxy(Governance, [NAME, SYMBOL, INITIAL_SUPPLY, OWNER.address])
  await token.deployed()

  console.info(`"${NAME}" [${SYMBOL}] deployed to ${token.address}`)
}

main()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
