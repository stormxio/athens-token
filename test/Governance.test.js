const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers')
const { deployProxy } = require('@openzeppelin/truffle-upgrades')

const Governance = artifacts.require('Governance')

const { INITIAL_SUPPLY, NAME, SYMBOL } = require('./Constants')
const { expectBN, expectEqual } = require('./Helpers')

contract('Governance', function (accounts) {
  const OWNER = accounts[0]
  const USER = accounts[1]
  const USER2 = accounts[2]

  beforeEach(async function () {
    this.token = await deployProxy(Governance, [NAME, SYMBOL, INITIAL_SUPPLY, OWNER], { initializer: 'initialize' })
    expectBN(await this.token.balanceOf(OWNER), INITIAL_SUPPLY)

    // no locked tokens initially for {USER}
    expectBN(await this.token.lockedBalanceOf(USER), 0)

    // transfer 1000 tokens to {USER}
    await this.token.transfer(USER, 1000, { from: OWNER })
  })

  describe('ERC20', function () {
    it('has correct name', async function () {
      expectEqual(await this.token.name(), NAME)
    })

    it('has correct symbol', async function () {
      expectEqual(await this.token.symbol(), SYMBOL)
    })

    it('has correct number of decimals', async function () {
      expectBN(await this.token.decimals(), 18)
    })

    it('has correct total supply', async function () {
      expectBN(await this.token.totalSupply(), INITIAL_SUPPLY)
    })
  })

  describe('Staking', function () {
    it('reads locked wallet balance successfully and emits TokenLocked event', async function () {
      // no locked tokens initially
      expectBN(await this.token.lockedBalanceOf(USER), 0)

      // lock certain amount of tokens
      const receipt = await this.token.lock(200, { from: USER })
      expectEvent(receipt, 'TokenLocked', {
        account: USER,
        amount: new BN(200),
      })

      // assert locked token balance
      expectBN(await this.token.lockedBalanceOf(USER), 200)

      // assert total balance
      expectBN(await this.token.balanceOf(USER), 1000)
    })

    it('reads unlocked balance successfully and emits TokenUnlocked event', async function () {
      // lock certain amount of tokens
      await this.token.lock(600, { from: USER })

      // assert unlocked token balance
      expectBN(await this.token.unlockedBalanceOf(USER), 400)

      // assert total balance
      expectBN(await this.token.balanceOf(USER), 1000)

      // unlock certain amount of tokens
      const receipt = await this.token.unlock(200, { from: USER })
      expectEvent(receipt, 'TokenUnlocked', {
        account: USER,
        amount: new BN(200),
      })

      // assert unlocked token balance again
      expectBN(await this.token.unlockedBalanceOf(USER), 600)

      // assert total balance
      expectBN(await this.token.balanceOf(USER), 1000)
    })
  })

  describe('Transfers', function () {
    it('sends transfer successfully', async function () {
      // no locked tokens initially
      expectBN(await this.token.lockedBalanceOf(USER2), 0)

      // lock certain amount of tokens
      await this.token.lock(800, { from: USER })

      // assert unlocked token balance
      expectBN(await this.token.unlockedBalanceOf(USER), 200)

      await this.token.transfer(USER2, 100, { from: USER })

      // assert proper total balance
      expectBN(await this.token.balanceOf(USER), 900)
      expectBN(await this.token.balanceOf(USER2), 100)

      // assert proper unlocked balance
      expectBN(await this.token.unlockedBalanceOf(USER), 100)
      expectBN(await this.token.unlockedBalanceOf(USER2), 100)
    })

    it('reverts a transfer if not enough unlocked token', async function () {
      // lock certain amount of tokens
      await this.token.lock(900, { from: USER })

      // assert unlocked token balance
      expectBN(await this.token.unlockedBalanceOf(USER), 100)

      // expect to revert the transfer
      await expectRevert(
        this.token.transfer(USER2, 200, { from: USER }),
        'Governance: Not enough unlocked token balance',
      )

      // assert total balance
      expectBN(await this.token.balanceOf(USER), 1000)
    })

    it('reverts transferFrom if not enough unlocked token', async function () {
      // lock certain amount of tokens
      await this.token.lock(950, { from: USER })

      // assert unlocked token balance
      expectBN(await this.token.unlockedBalanceOf(USER), 50)

      await this.token.approve(USER, 100, { from: USER })

      // expect to revert transferFrom
      await expectRevert(
        this.token.transferFrom(USER, USER2, 100, { from: USER }),
        'Governance: Not enough unlocked token balance of sender',
      )

      expectBN(await this.token.balanceOf(USER), 1000)
    })

    it('uses transferFrom successfully', async function () {
      // lock certain amount of tokens
      await this.token.lock(500, { from: USER })

      // assert unlocked token balance
      expectBN(await this.token.unlockedBalanceOf(USER), 500)
      await this.token.approve(USER, 500, { from: USER })
      await this.token.transferFrom(USER, USER2, 250, { from: USER })

      // assert that transferFrom only succeeds if sender is spender
      await expectRevert(
        this.token.transferFrom(USER, USER2, 250, { from: USER2 }),
        'ERC20: transfer amount exceeds allowance',
      )

      // assert proper total balance
      expectBN(await this.token.balanceOf(USER), 750)
      expectBN(await this.token.balanceOf(USER2), 250)

      // assert proper unlocked balance
      expectBN(await this.token.unlockedBalanceOf(USER), 250)
      expectBN(await this.token.unlockedBalanceOf(USER2), 250)
    })

    it('reverts lock if not enough unlocked token', async function () {
      // no locked tokens initially
      expectBN(await this.token.lockedBalanceOf(USER), 0)
      expectBN(await this.token.unlockedBalanceOf(USER), 1000)

      // locked amount exceeds unlocked balance of user
      await expectRevert(
        this.token.lock(1001, { from: USER }),
        'Governance: Not enough unlocked tokens',
      )

      // assert proper balance
      expectBN(await this.token.unlockedBalanceOf(USER), 1000)
      expectBN(await this.token.lockedBalanceOf(USER), 0)
      expectBN(await this.token.balanceOf(USER), 1000)
    })

    it('locks successfully', async function () {
      // no locked tokens initially
      expectBN(await this.token.lockedBalanceOf(USER), 0)
      expectBN(await this.token.unlockedBalanceOf(USER), 1000)
      
      // lock all tokens for the user
      await this.token.lock(1000, { from: USER })

      // token manipulation fails since all tokens are locked
      await expectRevert(
        this.token.transfer(USER2, 1000, { from: USER }),
        'Governance: Not enough unlocked token balance',
      )

      // assert proper balance for {USER}
      expectBN(await this.token.unlockedBalanceOf(USER), 0)
      expectBN(await this.token.lockedBalanceOf(USER), 1000)
      expectBN(await this.token.balanceOf(USER), 1000)

      // assert proper balance for {USER2}
      expectBN(await this.token.unlockedBalanceOf(USER2), 0)
      expectBN(await this.token.lockedBalanceOf(USER2), 0)
      expectBN(await this.token.balanceOf(USER2), 0)
    })

    it('reverts unlock if not enough locked token', async function () {
      // no locked tokens initially
      expectBN(await this.token.lockedBalanceOf(USER), 0)
      expectBN(await this.token.unlockedBalanceOf(USER), 1000)

      // locked amount exceeds unlocked balance of user
      await expectRevert(
        this.token.unlock(100, { from: USER }),
        'Governance: Not enough locked tokens',
      )

      // assert proper balance
      expectBN(await this.token.unlockedBalanceOf(USER), 1000)
      expectBN(await this.token.lockedBalanceOf(USER), 0)
      expectBN(await this.token.balanceOf(USER), 1000)
    })

    it('unlocks tokens successfully', async function () {
      // no locked tokens initially
      expectBN(await this.token.lockedBalanceOf(USER), 0)
      expectBN(await this.token.unlockedBalanceOf(USER), 1000)

      // lock all {USER} tokens
      await this.token.lock(1000, { from: USER })

      // token manipulation fails since all tokens are locked
      await expectRevert(
        this.token.transfer(USER2, 500, { from: USER }),
        'Governance: Not enough unlocked token balance',
      )

      // unlock certain amount of tokens for token manipulation
      await this.token.unlock(250, { from: USER })

      await this.token.transfer(USER2, 100, { from: USER })

      // assert proper balance of {USER}
      expectBN(await this.token.unlockedBalanceOf(USER), 150)
      expectBN(await this.token.lockedBalanceOf(USER), 750)
      expectBN(await this.token.balanceOf(USER), 900)

      // {USER2} receives the tokens
      expectBN(await this.token.unlockedBalanceOf(USER2), 100)
      expectBN(await this.token.lockedBalanceOf(USER2), 0)
      expectBN(await this.token.balanceOf(USER2), 100)
    })

    it('reverts if input lengths do not match in transfers', async function () {
      const recipients = [USER2, USER2]
      const values = [100]

      await expectRevert(
        this.token.transfers(recipients, values, { from: USER }),
        'Governance: Input lengths do not match',
      )
    })

    it('reverts if transfers not available', async function () {
      const recipients = [USER2, USER2]
      const values = [100, 100]

      await this.token.enableTransfers(false, { from: OWNER })
      await expectRevert(
        this.token.transfers(recipients, values, { from: USER }),
        'Governance: Transfers not available',
      )
    })

    it('reverts if any transfer fails', async function () {
      const recipients = [USER2, USER2]
      const values = [1000, 1]

      await expectRevert(
        this.token.transfers(recipients, values, { from: USER }),
        'Governance: Not enough unlocked token balance',
      )
    })

    it('uses transfers successfully', async function () {
      const recipients = [USER, USER2, OWNER]
      const values = [100, 100, 100]

      await this.token.transfers(recipients, values, { from: USER })
      expectBN(await this.token.balanceOf(USER), 800)
      expectBN(await this.token.balanceOf(USER2), 100)
      expectBN(await this.token.balanceOf(OWNER), INITIAL_SUPPLY - 1000 + 100)
    })

    it('allows the owner and only the owner to enable/disable transfers', async function () {
      const recipients = [USER2, USER2]
      const values = [100, 100]

      // non-owner fails to disable transfers
      await expectRevert(
        this.token.enableTransfers(false, { from: USER }),
        'Ownable: caller is not the owner',
      )
      await this.token.transfers(recipients, values, { from: USER })
      expectBN(await this.token.balanceOf(USER), 800)
      expectBN(await this.token.balanceOf(USER2), 200)

      // owner can disable transfers
      const receipt = await this.token.enableTransfers(false, { from: OWNER })
      expectEvent(receipt, 'TransfersEnabled', {
        newStatus: false,
      })
      await expectRevert(
        this.token.transfers(recipients, values, { from: USER }),
        'Governance: Transfers not available',
      )
      assert.equal(await this.token.balanceOf(USER), 800)
      assert.equal(await this.token.balanceOf(USER2), 200)

      // non-owner fails to enable transfers
      await expectRevert(
        this.token.enableTransfers(true, { from: USER }),
        'Ownable: caller is not the owner',
      )
      await expectRevert(
        this.token.transfers(recipients, values, { from: USER }),
        'Governance: Transfers not available',
      )
      assert.equal(await this.token.balanceOf(USER), 800)
      assert.equal(await this.token.balanceOf(USER2), 200)

      // owner can enable transfers
      const receipt2 = await this.token.enableTransfers(true, { from: OWNER })
      expectEvent(receipt2, 'TransfersEnabled', {
        newStatus: true,
      })
      await this.token.transfers(recipients, values, { from: USER })
      assert.equal(await this.token.balanceOf(USER), 600)
      assert.equal(await this.token.balanceOf(USER2), 400)
    })
  })

  describe('Upgradability', function () {
    it('reverts if initialize() called more than once', async function () {
      // expect to revert another initialization
      await expectRevert(
        this.token.initialize(NAME, SYMBOL, INITIAL_SUPPLY, OWNER),
        'Initializable: contract is already initialized',
      )
    })
  })
})
