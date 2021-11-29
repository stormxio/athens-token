import { ethers } from 'hardhat'

import verifyEnvVars from './helpers/env-vars'
import getEtherscanUri from './helpers/etherscan'

async function main() {
  const values = verifyEnvVars(['TOKEN', 'MERKLE_ROOT', 'LOCK_TIME'], 'DISTRIBUTOR')

  const [owner] = await ethers.getSigners()

  console.info(
    `Deploying Merkle Distributor with token "${values.TOKEN}", merkleRoot ` +
    `'${values.MERKLE_ROOT}', lockTime ${values.LOCK_TIME} and owner ${owner.address}...`
  )

  const MerkleDistributor = await ethers.getContractFactory('MerkleDistributor', owner)
  const merkleDistributor = await MerkleDistributor.deploy(
    values.TOKEN, values.MERKLE_ROOT, values.LOCK_TIME
  )

  console.info(`Check tx here: ${getEtherscanUri('tx', merkleDistributor.deployTransaction.hash)}`)

  await merkleDistributor.deployed()

  console.info(`Merkle Distributor deployed to: ${merkleDistributor.address}`)
  console.info(`Verify here: ${getEtherscanUri('address', merkleDistributor.address)}`)
}

main()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
