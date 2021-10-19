import '@typechain/hardhat'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'
import '@openzeppelin/hardhat-upgrades'
import 'solidity-coverage'

import dotenv from 'dotenv-extended'
import { HardhatUserConfig } from 'hardhat/config'
import { SolcUserConfig } from 'hardhat/types'

dotenv.load()

const getAccounts = (network: string): string[] | undefined => {
  let accounts
  const privateKey = process.env[`${network}_PRIVATE_KEY`]
  if (privateKey) {
    accounts = [privateKey]
  }
  return accounts
}

const DEFAULT_COMPILER_SETTINGS: SolcUserConfig = {
  version: '0.8.4',
  settings: {
    optimizer: {
      enabled: true,
      runs: 1_000_000,
    },
    metadata: {
      bytecodeHash: 'none',
    },
  },
}

const config: HardhatUserConfig = {
  networks: {
    hardhat: {
      allowUnlimitedContractSize: false,
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.MAINNET_INFURA_API_KEY}`,
      accounts: getAccounts('MAINNET'),
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${process.env.ROPSTEN_INFURA_API_KEY}`,
      accounts: getAccounts('ROPSTEN'),
    },
  },
  solidity: {
    compilers: [DEFAULT_COMPILER_SETTINGS],
  },
}

export default config
