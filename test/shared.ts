import { expect } from 'chai'
import { ethers } from 'hardhat'

import { Signers } from './types'

export { expect }

export const INITIAL_SUPPLY = 1_000_000
export const NAME = 'Governance'
export const SYMBOL = 'SGOV'

export const getSigners = async (): Promise<Signers> => {
  const [OWNER, USER1, USER2] = await ethers.getSigners()
  return {
    owner: {
      address: OWNER.address,
      signer: OWNER
    },
    user1: {
      address: USER1.address,
      signer: USER1,
    },
    user2: {
      address: USER2.address,
      signer: USER2,
    },
  }
}
