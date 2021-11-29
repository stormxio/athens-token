import { ethers, upgrades } from 'hardhat'

import { expect, getSigners, INITIAL_SUPPLY, NAME, SYMBOL, ZERO_ADDRESS } from './shared'
import { Signers } from './types'

import { Athens } from '../typechain'

describe('Athens', async () => {
  let signers: Signers
  let token: Athens

  before(async () => {
    signers = await getSigners()
  })

  beforeEach(async () => {
    const AthensContract = await ethers.getContractFactory('Athens')
    const args = [NAME, SYMBOL, INITIAL_SUPPLY, signers.owner.address]
    token = await upgrades.deployProxy(AthensContract, args, {
      initializer: 'initialize',
    }) as Athens
    expect(await token.balanceOf(signers.owner.address)).to.equal(INITIAL_SUPPLY)

    // no locked tokens initially for {user1}
    expect(await token.lockedBalanceOf(signers.user1.address)).to.equal(0)

    // transfer 1000 tokens to {user1}
    await token.connect(signers.owner.signer).transfer(signers.user1.address, 1000)
  })

  describe('ERC20', () => {
    it('reverts if initialize() called when owner is zero address', async () => {
      const AthensContract = await ethers.getContractFactory('Athens')
      const args = [NAME, SYMBOL, INITIAL_SUPPLY, ZERO_ADDRESS]
      // expect to revert when passed zero address
      await expect(upgrades.deployProxy(AthensContract, args, { initializer: 'initialize' }))
        .to.be.revertedWith('Owner must be non-zero address')
    })

    it('has correct name', async () => {
      expect(await token.name()).to.equal(NAME)
    })

    it('has correct symbol', async () => {
      expect(await token.symbol()).to.equal(SYMBOL)
    })

    it('has correct number of decimals', async () => {
      expect(await token.decimals()).to.equal(18)
    })

    it('has correct total supply', async () => {
      expect(await token.totalSupply()).to.equal(INITIAL_SUPPLY)
    })
  })

  describe('Staking', () => {
    it('reads locked wallet balance successfully and emits TokenLocked event', async () => {
      // no locked tokens initially
      expect(await token.lockedBalanceOf(signers.user1.address)).to.equal(0)

      // lock certain amount of tokens
      await expect(token.connect(signers.user1.signer).lock(200))
        .to.emit(token, 'TokenLocked')
        .withArgs(signers.user1.address, 200)

      // assert locked token balance
      expect(await token.lockedBalanceOf(signers.user1.address)).to.equal(200)

      // assert total balance
      expect(await token.balanceOf(signers.user1.address)).to.equal(1000)
    })

    it('reads unlocked balance successfully and emits TokenUnlocked event', async () => {
      // lock certain amount of tokens
      await token.connect(signers.user1.signer).lock(600)

      // assert unlocked token balance
      expect(await token.unlockedBalanceOf(signers.user1.address)).to.equal(400)

      // assert total balance
      expect(await token.balanceOf(signers.user1.address)).to.equal(1000)

      // unlock certain amount of tokens
      await expect(token.connect(signers.user1.signer).unlock(200))
        .to.emit(token, 'TokenUnlocked')
        .withArgs(signers.user1.address, 200)

      // assert unlocked token balance again
      expect(await token.unlockedBalanceOf(signers.user1.address)).to.equal(600)

      // assert total balance
      expect(await token.balanceOf(signers.user1.address)).to.equal(1000)
    })
  })

  describe('Transfers', () => {
    it('reverts when transfering to the contract', async () => {
      // expect to revert accidential transfers to the contract itself using transfer()
      await expect(token.connect(signers.user1.signer).transfer(token.address, 100))
        .to.be.revertedWith('Athens: Transfers to the contract not allowed')

      // expect to revert accidential transfers to the contract itself using transferFrom()
      await expect(token.connect(signers.user1.signer)
        .transferFrom(signers.user1.address, token.address, 100))
        .to.be.revertedWith('Athens: Transfers to the contract not allowed')
    })

    it('sends transfer successfully', async () => {
      // no locked tokens initially
      expect(await token.lockedBalanceOf(signers.user2.address)).to.equal(0)

      // lock certain amount of tokens
      await token.connect(signers.user1.signer).lock(800)

      // assert unlocked token balance
      expect(await token.unlockedBalanceOf(signers.user1.address)).to.equal(200)

      await token.connect(signers.user1.signer).transfer(signers.user2.address, 100)

      // assert proper total balance
      expect(await token.balanceOf(signers.user1.address)).to.equal(900)
      expect(await token.balanceOf(signers.user2.address)).to.equal(100)

      // assert proper unlocked balance
      expect(await token.unlockedBalanceOf(signers.user1.address)).to.equal(100)
      expect(await token.unlockedBalanceOf(signers.user2.address)).to.equal(100)
    })

    it('reverts a transfer if not enough unlocked token', async () => {
      // lock certain amount of tokens
      await token.connect(signers.user1.signer).lock(900)

      // assert unlocked token balance
      expect(await token.unlockedBalanceOf(signers.user1.address)).to.equal(100)

      // expect to revert the transfer
      await expect(token.connect(signers.user1.signer).transfer(signers.user2.address, 200))
        .to.be.revertedWith('Athens: Not enough unlocked token balance')

      // assert total balance
      expect(await token.balanceOf(signers.user1.address)).to.equal(1000)
    })

    it('reverts transferFrom if not enough unlocked token', async () => {
      // lock certain amount of tokens
      await token.connect(signers.user1.signer).lock(950)

      // assert unlocked token balance
      expect(await token.unlockedBalanceOf(signers.user1.address)).to.equal(50)

      await token.connect(signers.user1.signer).approve(signers.user1.address, 100)

      // expect to revert transferFrom
      await expect(token.connect(signers.user1.signer)
        .transferFrom(signers.user1.address, signers.user2.address, 100))
        .to.be.revertedWith('Athens: Not enough unlocked token balance of sender')

      expect(await token.balanceOf(signers.user1.address)).to.equal(1000)
    })

    it('uses transferFrom successfully', async () => {
      // lock certain amount of tokens
      await token.connect(signers.user1.signer).lock(500)

      // assert unlocked token balance
      expect(await token.unlockedBalanceOf(signers.user1.address)).to.equal(500)
      await token.connect(signers.user1.signer).approve(signers.user1.address, 500)
      await token.connect(signers.user1.signer)
        .transferFrom(signers.user1.address, signers.user2.address, 250)

      // assert that transferFrom only succeeds if sender is spender
      await expect(token.connect(signers.user2.signer)
        .transferFrom(signers.user1.address, signers.user2.address, 250))
        .to.be.revertedWith('ERC20: transfer amount exceeds allowance')

      // assert proper total balance
      expect(await token.balanceOf(signers.user1.address)).to.equal(750)
      expect(await token.balanceOf(signers.user2.address)).to.equal(250)

      // assert proper unlocked balance
      expect(await token.unlockedBalanceOf(signers.user1.address)).to.equal(250)
      expect(await token.unlockedBalanceOf(signers.user2.address)).to.equal(250)
    })

    it('reverts lock if not enough unlocked token', async () => {
      // no locked tokens initially
      expect(await token.lockedBalanceOf(signers.user1.address)).to.equal(0)
      expect(await token.unlockedBalanceOf(signers.user1.address)).to.equal(1000)

      // locked amount exceeds unlocked balance of user
      await expect(token.connect(signers.user1.signer).lock(1001))
        .to.be.revertedWith('Athens: Not enough unlocked tokens')

      // assert proper balance
      expect(await token.unlockedBalanceOf(signers.user1.address)).to.equal(1000)
      expect(await token.lockedBalanceOf(signers.user1.address)).to.equal(0)
      expect(await token.balanceOf(signers.user1.address)).to.equal(1000)
    })

    it('locks successfully', async () => {
      // no locked tokens initially
      expect(await token.lockedBalanceOf(signers.user1.address)).to.equal(0)
      expect(await token.unlockedBalanceOf(signers.user1.address)).to.equal(1000)
      
      // lock all tokens for the user
      await token.connect(signers.user1.signer).lock(1000)

      // token manipulation fails since all tokens are locked
      await expect(token.connect(signers.user1.signer).transfer(signers.user2.address, 1000))
        .to.be.revertedWith('Athens: Not enough unlocked token balance')

      // assert proper balance for {user1}
      expect(await token.unlockedBalanceOf(signers.user1.address)).to.equal(0)
      expect(await token.lockedBalanceOf(signers.user1.address)).to.equal(1000)
      expect(await token.balanceOf(signers.user1.address)).to.equal(1000)

      // assert proper balance for {user2}
      expect(await token.unlockedBalanceOf(signers.user2.address)).to.equal(0)
      expect(await token.lockedBalanceOf(signers.user2.address)).to.equal(0)
      expect(await token.balanceOf(signers.user2.address)).to.equal(0)
    })

    it('reverts unlock if not enough locked token', async () => {
      // no locked tokens initially
      expect(await token.lockedBalanceOf(signers.user1.address)).to.equal(0)
      expect(await token.unlockedBalanceOf(signers.user1.address)).to.equal(1000)

      // locked amount exceeds unlocked balance of user
      await expect(token.connect(signers.user1.signer).unlock(100))
        .to.be.revertedWith('Athens: Not enough locked tokens')

      // assert proper balance
      expect(await token.unlockedBalanceOf(signers.user1.address)).to.equal(1000)
      expect(await token.lockedBalanceOf(signers.user1.address)).to.equal(0)
      expect(await token.balanceOf(signers.user1.address)).to.equal(1000)
    })

    it('unlocks tokens successfully', async () => {
      // no locked tokens initially
      expect(await token.lockedBalanceOf(signers.user1.address)).to.equal(0)
      expect(await token.unlockedBalanceOf(signers.user1.address)).to.equal(1000)

      // lock all {user1} tokens
      await token.connect(signers.user1.signer).lock(1000)

      // token manipulation fails since all tokens are locked
      await expect(token.connect(signers.user1.signer).transfer(signers.user2.address, 500))
        .to.be.revertedWith('Athens: Not enough unlocked token balance')

      // unlock certain amount of tokens for token manipulation
      await token.connect(signers.user1.signer).unlock(250)

      await token.connect(signers.user1.signer).transfer(signers.user2.address, 100)

      // assert proper balance of {user1}
      expect(await token.unlockedBalanceOf(signers.user1.address)).to.equal(150)
      expect(await token.lockedBalanceOf(signers.user1.address)).to.equal(750)
      expect(await token.balanceOf(signers.user1.address)).to.equal(900)

      // {user2} receives the tokens
      expect(await token.unlockedBalanceOf(signers.user2.address)).to.equal(100)
      expect(await token.lockedBalanceOf(signers.user2.address)).to.equal(0)
      expect(await token.balanceOf(signers.user2.address)).to.equal(100)
    })

    it('reverts if input lengths do not match in transfers', async () => {
      const recipients = [signers.user1.address, signers.user2.address]
      const values = [100]

      await expect(token.connect(signers.user1.signer).transfers(recipients, values))
        .to.be.revertedWith('Athens: Input lengths do not match')
    })

    it('reverts if any transfer fails', async () => {
      const recipients = [signers.user2.address, signers.user2.address]
      const values = [1000, 1]

      await expect(token.connect(signers.user1.signer).transfers(recipients, values))
        .to.be.revertedWith('Athens: Not enough unlocked token balance')
    })

    it('uses transfers successfully', async () => {
      const recipients = [signers.user1.address, signers.user2.address, signers.owner.address]
      const values = [100, 100, 100]

      await token.connect(signers.user1.signer).transfers(recipients, values)
      expect(await token.balanceOf(signers.user1.address)).to.equal(800)
      expect(await token.balanceOf(signers.user2.address)).to.equal(100)
      expect(await token.balanceOf(signers.owner.address)).to.equal(INITIAL_SUPPLY - 1000 + 100)
    })
  })

  describe('Upgradability', () => {
    it('reverts if initialize() called more than once', async () => {
      // expect to revert another initialization
      await expect(token.initialize(NAME, SYMBOL, INITIAL_SUPPLY, signers.owner.address))
        .to.be.revertedWith('Initializable: contract is already initialized')
    })
  })
})
