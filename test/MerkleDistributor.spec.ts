
import { ethers } from 'hardhat'

import {
  expect,
  getBlockTimestamp,
  getSigners,
  increaseEvmTime,
  itCoverage,
  NAME,
  SYMBOL,
  INITIAL_SUPPLY,
  ZERO_ADDRESS,
} from './shared'
import { Signers } from './types'

import BalanceTree from '../scripts/helpers/balance-tree'
import { parseBalanceMap } from '../scripts/helpers/parse-balance-map'
import { Athens, MerkleDistributor } from '../typechain-types'

const ONE_BYTES32 = '0x0000000000000000000000000000000000000000000000000000000000000001'
const ONE_DAY_SECONDS = 86_400
const ZERO_BYTES32 = '0x0000000000000000000000000000000000000000000000000000000000000000'

const deployContracts = async (merkleRoot = ONE_BYTES32, lockTime = -1): Promise<{
  distributor: MerkleDistributor,
  token: Athens,
}> => {
  // default to current block timestamp + 1 day
  if (lockTime === -1) {
    const blockTimestamp = await getBlockTimestamp()
    lockTime = blockTimestamp + ONE_DAY_SECONDS
  }

  const signers = await getSigners()

  const AthensContract = await ethers.getContractFactory('Athens')
  const token = await AthensContract.deploy() as Athens
  token.initialize(NAME, SYMBOL, INITIAL_SUPPLY, signers.owner.address)

  const MerkleDistributorContract = await ethers.getContractFactory('MerkleDistributor')
  const distributor = await MerkleDistributorContract.deploy(
    token.target, merkleRoot, lockTime
  ) as MerkleDistributor

  return { distributor, token }
}

describe('MerkleDistributor', () => {
  let signers: Signers

  before(async () => {
    signers = await getSigners()
  })

  describe('Token', () => {
    it('reverts when token is zero address', async () => {
      const MerkleDistributorContract = await ethers.getContractFactory('MerkleDistributor')
      const lockTime = await getBlockTimestamp() + 60
      await expect(MerkleDistributorContract.deploy(ZERO_ADDRESS, ONE_BYTES32, lockTime))
        .to.be.revertedWith('Token must be non-zero address')
    })

    it('returns the token address', async () => {
      const { distributor, token } = await deployContracts()
      expect(await distributor.token()).to.equal(token.target)
    })
  })

  describe('Owner', () => {
    it('returns the owner', async () => {
      const { distributor } = await deployContracts()
      expect(await distributor.owner()).to.equal(signers.owner.address)
    })

    it('reverts when calling renounceOwnership', async () => {
      const { distributor } = await deployContracts()
      await expect(distributor.renounceOwnership())
        .to.be.revertedWith('MerkleDistributor: Renouncing the ownership disallowed')
    })
  })

  describe('MerkleRoot', () => {
    it('reverts when merkle root is zero', async () => {
      const AthensContract = await ethers.getContractFactory('Athens')
      const token = await AthensContract.deploy()
      const MerkleDistributorContract = await ethers.getContractFactory('MerkleDistributor')
      const lockTime = await getBlockTimestamp() + 60
      await expect(MerkleDistributorContract.deploy(token.target, ZERO_BYTES32, lockTime))
        .to.be.revertedWith('Merkle root must be non-zero')
    })

    it('returns the merkle root', async () => {
      const { distributor } = await deployContracts()
      expect(await distributor.merkleRoot()).to.equal(ONE_BYTES32)
    })
  })

  describe('LockTime', () => {
    it('reverts lock time is in the past', async () => {
      const AthensContract = await ethers.getContractFactory('Athens')
      const token = await AthensContract.deploy()
      const MerkleDistributorContract = await ethers.getContractFactory('MerkleDistributor')
      const lockTime = await getBlockTimestamp() - 60
      await expect(MerkleDistributorContract.deploy(token.target, ONE_BYTES32, lockTime))
        .to.be.revertedWith('Lock time must be in the future')
    })

    it('returns the lock time', async () => {
      const lockTime = await getBlockTimestamp() + 30
      const { distributor } = await deployContracts(ONE_BYTES32, lockTime)
      expect(await distributor.lockTime()).to.equal(lockTime)
    })
  })

  describe('Claim', () => {
    it('reverts when proof is empty', async () => {
      const { distributor } = await deployContracts()
      await expect(distributor.claim(0, signers.user1.address, 10, []))
        .to.be.revertedWith('MerkleDistributor: Invalid proof')
    })

    it('reverts when index is invalid', async () => {
      const { distributor } = await deployContracts()
      await expect(distributor.claim(0, signers.user1.address, 10, []))
        .to.be.revertedWith('MerkleDistributor: Invalid proof')
    })

    it('reverts when trying to claim after lockTime', async () => {
      const contracts = await deployContracts()
      await increaseEvmTime(ONE_DAY_SECONDS * 2)
      const localDistributor = contracts.distributor
      await expect(localDistributor.claim(0, signers.user1.address, 10, []))
        .to.be.revertedWith('MerkleDistributor: Cannot claim after lock time')
      await increaseEvmTime(-ONE_DAY_SECONDS * 2)
    })

    describe('two account tree', () => {
      let distributor: MerkleDistributor
      let tree: BalanceTree
      let token: Athens

      beforeEach(async () => {
        tree = new BalanceTree([
          { account: signers.user1.address, amount: BigInt("100") },
          { account: signers.user2.address, amount: BigInt("101") },
        ])
        const contracts = await deployContracts(tree.getHexRoot())
        distributor = contracts.distributor
        token = contracts.token

        await token.connect(signers.owner.signer).transfer(distributor.target, 201)
        expect(await token.balanceOf(distributor.target)).to.equal(201)
      })

      it('successful claim', async () => {
        const proof0 = tree.getProof(0, signers.user1.address, BigInt("100"))
        await expect(distributor.claim(0, signers.user1.address, 100, proof0))
          .to.emit(distributor, 'Claimed')
          .withArgs(0, signers.user1.address, 100)

        const proof1 = tree.getProof(1, signers.user2.address, BigInt("101"))
        await expect(distributor.claim(1, signers.user2.address, 101, proof1))
          .to.emit(distributor, 'Claimed')
          .withArgs(1, signers.user2.address, 101)
      })

      it('transfers the token', async () => {
        const proof0 = tree.getProof(0, signers.user1.address, 100n)
        expect(await token.balanceOf(signers.user1.address)).to.equal(0)
        await distributor.claim(0, signers.user1.address, 100, proof0)
        expect(await token.balanceOf(signers.user1.address)).to.equal(100)
        expect(await token.balanceOf(distributor.target)).to.equal(101)
      })

      it('must have enough to transfer', async () => {
        const contracts = await deployContracts(tree.getHexRoot())
        const localDistributor = contracts.distributor
        const proof0 = tree.getProof(0, signers.user1.address, BigInt(100))
        await expect(localDistributor.claim(0, signers.user1.address, 100, proof0))
          .to.be.revertedWith('Athens: Not enough unlocked token balance')
      })

      it('sets isClaimed', async () => {
        const proof0 = tree.getProof(0, signers.user1.address, BigInt(100))
        expect(await distributor.isClaimed(0)).to.equal(false)
        expect(await distributor.isClaimed(1)).to.equal(false)

        await distributor.claim(0, signers.user1.address, 100, proof0)
        expect(await distributor.isClaimed(0)).to.equal(true)
        expect(await distributor.isClaimed(1)).to.equal(false)
      })

      it('cannot allow two claims', async () => {
        const proof0 = tree.getProof(0, signers.user1.address, BigInt(100))
        await distributor.claim(0, signers.user1.address, 100, proof0)
        await expect(distributor.claim(0, signers.user1.address, 100, proof0))
          .to.be.revertedWith('MerkleDistributor: Drop already claimed')
      })

      it('cannot claim more than once: 0 and then 1', async () => {
        const proof0 = tree.getProof(0, signers.user1.address, BigInt(100))
        await distributor.claim(0, signers.user1.address, 100, proof0)

        const proof1 = tree.getProof(1, signers.user2.address, BigInt(101))
        await distributor.claim(1, signers.user2.address, 101, proof1)

        await expect(distributor.claim(0, signers.user1.address, 100, proof0))
          .to.be.revertedWith('MerkleDistributor: Drop already claimed')
      })

      it('cannot claim more than once: 1 and then 0', async () => {
        const proof1 = tree.getProof(1, signers.user2.address, BigInt(101))
        await distributor.claim(1, signers.user2.address, 101, proof1)

        const proof0 = tree.getProof(0, signers.user1.address, BigInt(100))
        await distributor.claim(0, signers.user1.address, 100, proof0)

        await expect(distributor.claim(1, signers.user2.address, 101, proof1))
          .to.be.revertedWith('MerkleDistributor: Drop already claimed')
      })

      it('cannot claim for address other than proof', async () => {
        const proof0 = tree.getProof(0, signers.user1.address, BigInt(100))
        await expect(distributor.claim(1, signers.user2.address, 101, proof0))
          .to.be.revertedWith('MerkleDistributor: Invalid proof')
      })

      it('cannot claim more than proof', async () => {
        const proof0 = tree.getProof(0, signers.user1.address, BigInt(100))
        await expect(distributor.claim(0, signers.user1.address, 101, proof0))
          .to.be.revertedWith('MerkleDistributor: Invalid proof')
      })

      itCoverage('gas', async () => {
        const proof = tree.getProof(0, signers.user1.address, BigInt(100))
        const tx = await distributor.claim(0, signers.user1.address, 100, proof)
        const receipt = await tx.wait()
        expect(receipt.gasUsed).to.equal(83645)
      })
    })

    describe('larger tree', () => {
      let distributor: MerkleDistributor
      let tree: BalanceTree
      let token: Athens

      beforeEach(async () => {
        tree = new BalanceTree(
          Object.keys(signers).map((key, index) => {
            const signer = signers[key as keyof Signers]
            return {
              account: signer.address,
              amount: BigInt(index + 1),
            }
          })
        )

        const contracts = await deployContracts(tree.getHexRoot())
        distributor = contracts.distributor
        token = contracts.token

        await token.connect(signers.owner.signer).transfer(distributor.target, 201)
        expect(await token.balanceOf(distributor.target)).to.equal(201)
      })

      it('claim index 4', async () => {
        const proof = tree.getProof(4, signers.user4.address, BigInt(5))
        await expect(distributor.claim(4, signers.user4.address, 5, proof))
          .to.emit(distributor, 'Claimed')
          .withArgs(4, signers.user4.address, 5)
      })

      it('claim index 9', async () => {
        const proof = tree.getProof(9, signers.user9.address, BigInt(10))
        await expect(distributor.claim(9, signers.user9.address, 10, proof))
          .to.emit(distributor, 'Claimed')
          .withArgs(9, signers.user9.address, 10)
      })

      itCoverage('gas', async () => {
        const proof = tree.getProof(9, signers.user9.address, BigInt(10))
        const tx = await distributor.claim(9, signers.user9.address, 10, proof)
        const receipt = await tx.wait()
        expect(receipt.gasUsed).to.equal(86167)
      })

      itCoverage('gas second down about 15k', async () => {
        const proof0 = tree.getProof(1, signers.user1.address, BigInt(2))
        await distributor.claim(1, signers.user1.address, 2, proof0)

        const proof1 = tree.getProof(2, signers.user2.address, BigInt(3))
        const tx = await distributor.claim(2, signers.user2.address, 3, proof1)
        const receipt = await tx.wait()
        expect(receipt.gasUsed).to.equal(69065)
      })
    })

    describe('realistic size tree', () => {
      let distributor: MerkleDistributor
      let tree: BalanceTree

      const NUM_LEAVES = 100_000
      const NUM_SAMPLES = 25

      before(() => {
        const elements: {
          account: string
          amount: BigInt
        }[] = []

        for (let i = 0; i < NUM_LEAVES; i++) {
          const node = {
            account: signers.user1.address,
            amount: BigInt(100),
          }
          elements.push(node)
        }

        tree = new BalanceTree(elements)
      })

      beforeEach(async () => {
        const contracts = await deployContracts(tree.getHexRoot())
        distributor = contracts.distributor
        const token = contracts.token

        await token.connect(signers.owner.signer).transfer(distributor.target, 10_000)
        expect(await token.balanceOf(distributor.target)).to.equal(10_000)
      })

      it('proof verification works', () => {
        const root = Buffer.from(tree.getHexRoot().slice(2), 'hex')
        for (let i = 0; i < NUM_LEAVES; i += NUM_LEAVES / NUM_SAMPLES) {
          const proof = tree
            .getProof(i, signers.user1.address, BigInt(100))
            .map((el) => Buffer.from(el.slice(2), 'hex'))
          const validProof = BalanceTree.verifyProof(
            i, signers.user1.address, BigInt(100), proof, root
          )
          expect(validProof).to.be.true
        }
      })

      itCoverage('gas', async () => {
        const proof = tree.getProof(50000, signers.user1.address, BigInt(100))
        const tx = await distributor.claim(50000, signers.user1.address, 100, proof)
        const receipt = await tx.wait()
        expect(receipt.gasUsed).to.equal(97016)
      })

      itCoverage('gas deeper node', async () => {
        const proof = tree.getProof(90000, signers.user1.address, BigInt(100))
        const tx = await distributor.claim(90000, signers.user1.address, 100, proof)
        const receipt = await tx.wait()
        expect(receipt.gasUsed).to.equal(97030)
      })

      itCoverage('gas average random distribution', async () => {
        let total = BigInt(0)
        let count = 0

        for (let i = 0; i < NUM_LEAVES; i += NUM_LEAVES / NUM_SAMPLES) {
          const proof = tree.getProof(i, signers.user1.address, BigInt(100))
          const tx = await distributor.claim(i, signers.user1.address, 100, proof)
          const receipt = await tx.wait()
          total = total + receipt.gasUsed
          count++
        }

        const average = total / BigInt(count)
        expect(average).to.equal(80582)
      })

      // this is what we gas golfed by packing the bitmap
      itCoverage('gas average first 25', async () => {
        let total = BigInt(0)
        let count = 0

        for (let i = 0; i < 25; i++) {
          const proof = tree.getProof(i, signers.user1.address, BigInt(100))
          const tx = await distributor.claim(i, signers.user1.address, 100, proof)
          const receipt = await tx.wait()
          total = total + receipt.gasUsed
          count++
        }

        const average = total / BigInt(count)
        expect(average).to.equal(64155)
      })

      it('no double claims in random distribution', async () => {
        for (let i = 0; i < 25; i += Math.floor(Math.random() * (NUM_LEAVES / NUM_SAMPLES))) {
          const proof = tree.getProof(i, signers.user1.address, BigInt(100))
          await distributor.claim(i, signers.user1.address, 100, proof)
          await expect(distributor.claim(i, signers.user1.address, 100, proof))
            .to.be.revertedWith('MerkleDistributor: Drop already claimed')
        }
      })
    })
  })

  describe('parseBalanceMap', () => {
    let claims: {
      [account: string]: {
        index: number
        amount: string
        proof: string[]
      }
    }
    let distributor: MerkleDistributor
    let token: Athens

    let signers: Signers


    beforeEach(async () => {
      signers = await getSigners()

      const { claims: innerClaims, merkleRoot, tokenTotal } = parseBalanceMap({
        [signers.user1.address]: 200,
        [signers.user2.address]: 300,
        [signers.user3.address]: 250,
      })

      expect(tokenTotal).to.equal('750') // 750
      claims = innerClaims

      const contracts = await deployContracts(merkleRoot)
      distributor = contracts.distributor
      token = contracts.token

      await token.connect(signers.owner.signer).transfer(distributor.target, tokenTotal)
      expect(await token.balanceOf(distributor.target)).to.equal(tokenTotal)
    })

    it('check the proofs is as expected', () => {
      expect(claims).to.deep.equal({
        '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC': {
          index: 0,
          amount: '300',
          proof: [
            '0x00022f0f335eeb9188dc092e656ee07c60b63503bb68aa508bdd8275468827e7',
            '0xd48eef31cb6b7ef5a8fb8ef79608aaa21a3c0c17855c721bfda30e965334ff52'
          ]
        },
        '0x70997970C51812dc3A010C7d01b50e0d17dc79C8': {
          index: 1,
          amount: '200',
          proof: [
            '0xca972cf3b814f50a7192e9778e23f6bdbb600c1245980898d250c67065d50622',
            '0xd48eef31cb6b7ef5a8fb8ef79608aaa21a3c0c17855c721bfda30e965334ff52'
          ]
        },
        '0x90F79bf6EB2c4f870365E785982E1f101E93b906': {
          index: 2,
          amount: '250',
          proof: [
            '0x4539c90b4bedec9d94419556bfd3fab8bc0359e2e050f7f99d275b137a2c8b76'
          ]
        }
      })
    })

    it('all claims work exactly once', async () => {
      for (const account in claims) {
        const claim = claims[account]

        await expect(distributor.claim(claim.index, account, claim.amount, claim.proof))
          .to.emit(distributor, 'Claimed')
          .withArgs(claim.index, account, claim.amount)

        await expect(distributor.claim(claim.index, account, claim.amount, claim.proof))
          .to.be.revertedWith('MerkleDistributor: Drop already claimed')
      }

      expect(await token.balanceOf(distributor.target)).to.equal(0)
    })
  })

  describe('Recover', () => {
    let distributor: MerkleDistributor

    beforeEach(async () => {
      const contracts = await deployContracts()
      const token = contracts.token
      distributor = contracts.distributor

      await token.connect(signers.owner.signer).transfer(distributor.target, 201)
      expect(await token.balanceOf(distributor.target)).to.equal(201)
    })

    it('only the owner can call recover', async () => {
      await expect(distributor.connect(signers.user1.signer).recover(100))
        .to.be.revertedWith('Ownable: caller is not the owner')
    })

    it('reverts when trying to recover before lockTime', async () => {
      await expect(distributor.connect(signers.owner.signer).recover(1))
        .to.be.revertedWith('MerkleDistributor: Cannot recover the tokens before lock time')
    })

    it('reverts when trying to recover due to not enough balance', async () => {
      const contracts = await deployContracts()
      const localDistributor = contracts.distributor

      await increaseEvmTime(ONE_DAY_SECONDS * 2)
      await expect(localDistributor.connect(signers.owner.signer).recover(202)) // vs 201
        .to.be.revertedWith('Athens: Not enough unlocked token balance')
      await increaseEvmTime(-ONE_DAY_SECONDS * 2)
    })

    it('recovers after lockTime', async () => {
      const contracts = await deployContracts()
      const localDistributor = contracts.distributor
      const localToken = contracts.token

      await localToken.connect(signers.owner.signer).transfer(localDistributor.target, 201)
      expect(await localToken.balanceOf(localDistributor.target)).to.equal(201)

      const startBalance = await localToken.balanceOf(signers.owner.address)

      await increaseEvmTime(ONE_DAY_SECONDS * 2)
      expect(await localDistributor.connect(signers.owner.signer).recover(100))
        .to.emit(localDistributor, 'Recovered')
        .withArgs(100)
      await increaseEvmTime(-ONE_DAY_SECONDS * 2)

      expect(await localToken.balanceOf(localDistributor.target)).to.equal(101)
      expect(await localToken.balanceOf(signers.owner.address)).to.equal(Number(startBalance) + 100)
    })
  })
})
