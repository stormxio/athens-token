# governance-token

[![Coverage](https://github.com/stormxio/governance-token/actions/workflows/Coverage.yml/badge.svg)](https://github.com/stormxio/governance-token/actions/workflows/Coverage.yml)

## Executive Summary

StormX currently operates an ERC20 token deployed on Ethereum mainnet. The token contract includes a feature for permissioned voting by locking “staking” the tokens. The user is then allowed to vote off-chain via Snapshot.org. The contract also includes upgradabilty via OpenZepplin’s upgradable plugin.

This document provides information about the developed solution.

## Requirements

Governance is the new token contract implemented by StormX. It supports the standard ERC20 interface, transferring in batch, upgradability, and staking features.

- Supports the standard ERC20 interface
- The name of the token is "Governance" (to be changed)
- The symbol of the token is "SGOV" (to be changed)
- The decimals remain according to the standard
- The token is ownable
- StormX owns the token
- It has transfers function for batch token sending
- Token implements staking functionality
- Staking functionality is available through lock and unlock methods
- Users cannot manipulate locked tokens
- Users can transfer the tokens when they're unlocked
- Locked tokens are owned by the user and are reported with balanceOf function
- Anyone can read locked balance of the user
- The token is upgradable using OpenZeppelin Upgrades Plugins
- Only the owner can upgrade the token implementation

## Technical Executions

StormX developed the contract according to the requirements using Solidity, Hardhat and TypeScript. This section outlines the technical solution.

### Standard ERC20 interface

Governance token is in compliance with ERC20 as described in ​[eip-20.md](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md)​. This token contract is upgradable, ownable, and mintable. [OpenZeppelin ERC20Upgradeable](https://github.com/OpenZeppelin/openzeppelin-contracts-upgradeable/blob/master/contracts/token/ERC20/ERC20Upgradeable.sol) implementation is used to inherit the ERC20 standard interface.

### Allowance Double-Spend Exploit

Allowance double-spend exploit is mitigated in this contract with functions `increaseAllowance()` and `decreaseAllowance()`.

However, community agreement on an ERC standard that would protect against this exploit is still pending. Users should be aware of this exploit when interacting with this contract. Developers who use `approve()`/`transferFrom()` should keep in mind that they have to set allowance to 0 first and verify if it was used before setting the new value.

### Mint

The function `mint()` is used only during the `initialize()` to mint a fixed amount of tokens. Because of a requirement of the proxy-based upgradability system, no constructors can be used in upgradable contracts. This means that a typically named `initialize()` function has to be used instead and it can be called only once.

### Transferring in batch

Anyone can call the method `transfers()` to perform multiple transferring in a single function call.

```solidity
function transfers(
    address[] memory recipients, 
    uint256[] memory values
  ) public returns (bool)
```

### Staking Feature

The Governance token includes a staking feature and StormX will reward users for any staked tokens they have. The staking feature is compatible with how the STMX token implements it.

This feature comprises the following sections.

#### Lock

By invoking the function `lock()`, users can lock any amount of Governance tokens as long as they have enough unlocked token balance. Locked tokens can not be manipulable by any means. Once the specified amount of tokens are locked successfully, interest starts to be accumulated and calculated off-chain by StormX. The locked token balance of users can be read via read methods (see section Read Methods). While the users are not able to perform any operations on locked tokens, these locked tokens are still reported as owned by the users when the method `balanceOf()` is called. The event `TokenLocked(address account, uint256 amount)` is emitted.

```solidity
function lock(uint256 amount) public returns (bool)
```

#### Unlock

By invoking the function `unlock()`, users are able to unlock any amount of locked Governance tokens they have and are able to perform any operations on their unlocked tokens as desired. Once the specified amount of tokens becomes unlocked, those tokens will no longer accumulate interest. The event `TokenUnlocked(address account, uint256 amount)` is emitted.

```solidity
function unlock(uint256 amount) public returns (bool)
```

#### Read Methods

Anyone can call read methods to retrieve the different kinds of balance.

 1. `lockedBalanceOf(address account)` returns the amount of locked tokens the account holds

 2. `unlockedBalanceOf(address account)` returns the amount of unlock tokens the account holds

 3. `balanceOf(address account)` returns the total amount of tokens the account holds, i.e the sum of locked and unlocked tokens 

#### Reward

Any rewards accumulated are calculated off-chain and sent to the StormX account holder.

### Upgradability

The token uses OpenZeppelin Upgrades Plugins Upgradability. Writing upgradable smart contracts requires some restrictions to be worked around. Please see https://docs.openzeppelin.com/upgrades-plugins/1.x/ for more detailed information about mentioned upgradability system.

When upgrading the smart contract to a new version, a Solidity developer should be fully aware of what that entails.

 1. https://docs.openzeppelin.com/learn/upgrading-smart-contracts

 2. https://docs.openzeppelin.com/upgrades-plugins/1.x/writing-upgradeable

## Local Development

### Install dependencies

```sh
yarn
```

`postinstall` script should run after installing the dependencies to compile the contracts using Hardhat and generate TypeScript type definitions.

### Run coverage

```sh
yarn coverage
```

### Deployment

Deployment script files are not included in the repository. However, they can be easily created thanks to Hardhat.

```ts
// scripts/deploy.ts
import { ethers, upgrades } from 'hardhat'

async function main() {
  const NAME = 'Governance'
  const SYMBOL = 'SGOV'
  const INITIAL_SUPPLY = 1_000_000
  const [OWNER] = await ethers.getSigners()

  console.info(`Deploying ${NAME} [${SYMBOL}] with initial supply of ${INITIAL_SUPPLY} and owner ${OWNER.address}...`)

  const Governance = await ethers.getContractFactory('Governance')
  const token = await upgrades.deployProxy(Governance, [NAME, SYMBOL, INITIAL_SUPPLY, OWNER.address])
  await token.deployed()

  console.info(`${NAME} [${SYMBOL}] deployed to ${token.address}`)
}

main()
```
