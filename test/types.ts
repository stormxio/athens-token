import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'

interface Signer {
  address: string
  signer: SignerWithAddress
}

export interface Signers {
  owner: Signer
  user1: Signer
  user2: Signer
}
