// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";

contract Governance is Initializable, OwnableUpgradeable, ERC20Upgradeable {
    // Staking variable
    mapping(address => uint256) public lockedBalanceOf;

    // Staking events
    event TokenLocked(address indexed account, uint256 amount);
    event TokenUnlocked(address indexed account, uint256 amount);

    function initialize(
        string memory name_,
        string memory symbol_,
        uint256 initialSupply_,
        address owner_
    ) public virtual initializer {
        __Governance_init(name_, symbol_, initialSupply_, owner_);
    }

    /**
     * @dev init function is used instead of constructors because
     *      no constructors can be used in upgradable contracts
     * @param name_ name of the token
     * @param symbol_ symbol of the token
     * @param initialSupply_ amount of tokens to be minted and transfered to {owner}
     * @param owner_ smart contract owner
     */
    function __Governance_init(
        string memory name_,
        string memory symbol_,
        uint256 initialSupply_,
        address owner_
    ) internal initializer {
        __Context_init_unchained();
        __Ownable_init_unchained();
        __ERC20_init_unchained(name_, symbol_);
        __Governance_init_unchained(initialSupply_, owner_);
    }

    /**
     * @dev mints {initialSupply} amount of token for {owner}
     * @param initialSupply_ amount of tokens to be minted for {owner}
     * @param owner_ smart contract owner
     */
    function __Governance_init_unchained(uint256 initialSupply_, address owner_) internal initializer {
        _mint(owner_, initialSupply_);
    }

    /**
     * @dev returns the amount of unlocked tokens the account holds
     *      balanceOf - lockedBalanceOf should always be >= 0
     * @param account address of a user to query for unlocked balance
     * @return the amount of unlocked tokens of the given address
     *         i.e. the amount of manipulable tokens of the given address
     */
    function unlockedBalanceOf(address account) public view returns (uint256) {
        return balanceOf(account) - lockedBalanceOf[account];
    }

    /**
     * @dev Locks specified amount of tokens for the user
     *      Locked tokens are not manipulable until being unlocked
     *      Locked tokens are still reported as owned by the user when ``balanceOf()`` is called
     * @param amount specified amount of tokens to be locked
     * @return success status of the locking
     */
    function lock(uint256 amount) public returns (bool) {
        address account = _msgSender();
        require(unlockedBalanceOf(account) >= amount, "Governance: Not enough unlocked tokens");
        lockedBalanceOf[account] = lockedBalanceOf[account] + amount;
        emit TokenLocked(account, amount);
        return true;
    }

    /**
     * @dev Unlocks specified amount of tokens for the user
     *      Unlocked tokens are manipulable until being locked
     * @param amount specified amount of tokens to be unlocked
     * @return success status of the unlocking
     */
    function unlock(uint256 amount) public returns (bool) {
        address account = _msgSender();
        require(lockedBalanceOf[account] >= amount, "Governance: Not enough locked tokens");
        lockedBalanceOf[account] = lockedBalanceOf[account] - amount;
        emit TokenUnlocked(account, amount);
        return true;
    }

    /**
     * @dev The only difference from standard ERC20 ``transferFrom()`` is that
     *      it only succeeds if the sender has enough unlocked tokens
     * @param sender address of the sender
     * @param recipient address of the recipient
     * @param amount specified amount of tokens to be transferred
     * @return success status of the transferring
     */
    function transferFrom(address sender, address recipient, uint256 amount) public override returns (bool) {
        require(unlockedBalanceOf(sender) >= amount, "Governance: Not enough unlocked token balance of sender");
        return super.transferFrom(sender, recipient, amount);
    }

    /**
     * @dev The only difference from standard ERC20 ``transfer()`` is that
     *      it only succeeds if the user has enough unlocked tokens
     * @param recipient address of the recipient
     * @param amount specified amount of tokens to be transferred
     * @return success status of the transferring
     */
    function transfer(address recipient, uint256 amount) public override returns (bool) {
        require(unlockedBalanceOf(_msgSender()) >= amount, "Governance: Not enough unlocked token balance");
        return super.transfer(recipient, amount);
    }

    /**
     * @dev Transfers tokens in batch
     * @param recipients an array of recipient addresses
     * @param values an array of specified amount of tokens to be transferred
     * @return success status of the batch transferring
     */
    function transfers(address[] memory recipients, uint256[] memory values) public returns (bool) {
        require(recipients.length == values.length, "Governance: Input lengths do not match");
        for (uint256 i = 0; i < recipients.length; i++) {
            transfer(recipients[i], values[i]);
        }
        return true;
    }
    uint256[50] private __gap; // https://docs.openzeppelin.com/contracts/3.x/upgradeable#storage_gaps
}
