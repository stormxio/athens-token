import { expect } from 'chai'
import { ethers } from 'hardhat'
import Mocha from 'mocha'

import { Signer, Signers } from './types'

export { expect }

export const INITIAL_SUPPLY = 1000000
export const NAME = 'Athens'
export const SYMBOL = 'ATH'
export const ZERO_ADDRESS = ethers.ZeroAddress

export const getBlockTimestamp = async (): Promise<number> => {
  const blockNumber = await ethers.provider.getBlockNumber()
  const block = await ethers.provider.getBlock(blockNumber)
  return block.timestamp
}

export const getSigners = async (): Promise<Signers> => {
  const signers = await ethers.getSigners()

  const users: Record<string, Signer> = {}
  for (let i = 1; i < 10; i++) {
    users[`user${i}`] = {
      address: signers[i].address,
      signer: signers[i],
    }
  }

  return {
    owner: {
      address: signers[0].address,
      signer: signers[0]
    },
    ...users
  } as Signers
}

export const increaseEvmTime = async (seconds: number): Promise<void> => {
  await ethers.provider.send('evm_increaseTime', [seconds])
  await ethers.provider.send('evm_mine', [])
}

export const itCoverage = async (title: string, fn?: Mocha.Func): Promise<Mocha.Test> =>
  process.env.RUNNING_COVERAGE === '1' ? it.skip(title, fn) : it(title, fn)
