# athens-token

[![Coverage](https://github.com/stormxio/athens-token/actions/workflows/Coverage.yml/badge.svg)](https://github.com/stormxio/athens-token/actions/workflows/Coverage.yml)
[![Test](https://github.com/stormxio/athens-token/actions/workflows/Test.yml/badge.svg)](https://github.com/stormxio/athens-token/actions/workflows/Test.yml)

Athens (ATH) is deployed on [mainnet](https://etherscan.io/token/0x2f9411088cef82fd9fb904eb8092f28eb485c8f6): `0x2f9411088cef82fd9fb904eb8092f28eb485c8f6`

## Executive Summary

StormX currently operates an ERC20 token deployed on Ethereum mainnet. The token contract includes a feature for permissioned voting by locking “staking” the tokens. The user is then allowed to vote off-chain via Snapshot.org. The contract also includes upgradabilty via OpenZepplin’s upgradable plugin.

This document provides information about the developed solution.

## Requirements

Athens is the new token contract implemented by StormX. It supports the standard ERC20 interface, transferring in batch, upgradability, and staking features.

- Supports the standard ERC20 interface
- The name of the token is "Athens"
- The symbol of the token is "ATH"
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

## Governance

We believe it is in the best interest of the community to start with low friction, low cost, flexible off-chain voting using https://snapshot.org. The voting system does not require the user to pay large amounts of gas to execute votes and thus it promotes higher voter engagement which is the most important metric in any governance project. Snapshot also has the added benefit of experimenting with voting weight strategies using on-chain and off-chain data. The simplest strategy to start is “coin voting” since it does not require us to make assumptions on the best voting weights to use initially. As the community helps us determine fair voting weights via Discord discussions we will propose new SIP, StormX Improvement Proposals for the community to vote on.

## Technical Executions

StormX developed the contract according to the requirements using Solidity, Hardhat and TypeScript. This section outlines the technical solution.

### Standard ERC20 interface

Athens token is in compliance with ERC20 as described in ​[eip-20.md](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md)​. This token contract is upgradable, ownable, and mintable. [OpenZeppelin ERC20Upgradeable](https://github.com/OpenZeppelin/openzeppelin-contracts-upgradeable/blob/master/contracts/token/ERC20/ERC20Upgradeable.sol) implementation is used to inherit the ERC20 standard interface.

### Allowance Double-Spend Exploit

Allowance double-spend exploit is mitigated in this contract with functions `increaseAllowance()` and `decreaseAllowance()`.

However, community agreement on an ERC standard that would protect against this exploit is still pending. Users should be aware of this exploit when interacting with this contract. Developers who use `approve()`/`transferFrom()` should keep in mind that they have to set allowance to 0 first and verify if it was used before setting the new value.

### Ownable

The contract `Athens.sol` uses ownable pattern and has a function `owner()` to report the address with special privileges. Currently, the owner only receives all the initial supply tokens, and there are no additional functionalities associated with the ownable pattern. That may change in the future versions of the contract. The contract owner must be non-zero or the deployment will be reverted.

### Mint

The function `mint()` is used only during the `initialize()` to mint a fixed amount of tokens. Because of a requirement of the proxy-based upgradability system, no constructors can be used in upgradable contracts. This means that a typically named `initialize()` function has to be used instead and it can be called only once.

### Transferring in batch

Anyone can call the method `transfers()` to perform multiple transferring in a single function call. Homever this is mainly used by the owner/company to distribute the tokens in batch. Normal users are discouraged from executing this function, because arrays with a very large number of elements could cause this function to revert due to exceeding the block size during execution.

```solidity
function transfers(
    address[] memory recipients, 
    uint256[] memory values
  ) public returns (bool)
```

### Staking Feature

The Athens token includes a staking feature and StormX will reward users for any staked tokens they have. The staking feature is compatible with how the STMX token implements it.

This feature comprises the following sections.

#### Lock

By invoking the function `lock()`, users can lock any amount of Athens tokens as long as they have enough unlocked token balance. Locked tokens can not be manipulable by any means. Once the specified amount of tokens are locked successfully, interest starts to be accumulated and calculated off-chain by StormX. The locked token balance of users can be read via read methods (see section Read Methods). While the users are not able to perform any operations on locked tokens, these locked tokens are still reported as owned by the users when the method `balanceOf()` is called. The event `TokenLocked(address account, uint256 amount)` is emitted.

```solidity
function lock(uint256 amount) public returns (bool)
```

#### Unlock

By invoking the function `unlock()`, users are able to unlock any amount of locked Athens tokens they have and are able to perform any operations on their unlocked tokens as desired. Once the specified amount of tokens becomes unlocked, those tokens will no longer accumulate interest. The event `TokenUnlocked(address account, uint256 amount)` is emitted.

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

## Merkle Distributor

A Merkle distributor approach is used to allow the users to withdraw their airdrop tokens. Owner, Lock Time, and Recover functionalities are added in addition to standard Merkle distributor.

(more details about the airdrop to be added)

### Ownable

The contract `MerkleDistributor.sol` uses ownable pattern and has a function `owner()` to report the address with special privileges. Only the owner is allowed to use `recover()` function. There are no other functionalities related to the owner.

### Lock Time

`lockTime()` returns a timestamp passed during contract deployment. Any `claim()` invocations after the lockTime timestamp will be reverted. Respectively, any `recover()` invocations that happen before lockTime will be reverted.

### Recover

By calling the function `recover()`, an owner can transfer the remaining tokens to it's account. That must happen after lockTime when claiming is not allowed anymore. The event `Recovered(uint256 amount)` is emitted.

### Usage

 1. Create a JSON file that Merkle Tree will be based on, e.g.: `wallets.json`. It should contain a single level JSON with the wallet as a key and amount as a value, e.g.: ``{ "0x123": 100000000000000000000, "0x234": 110000000000000000000 }``

 2. Run Merkle Tree generator script: `npx ts-node ./scripts/generate-merkle-root.ts -i wallets.json > tree.json`

 3. Verify generated tree using: `npx ts-node ./scripts/verify-merkle-root.ts -i tree.json`

 4. Check [Deployment section](#deployment) to deploy Merkle Distributor contract: `npx hardhat run ./scripts/deploy-merkle-distributor.ts`

 5. Send enough tokens to deployed Merkle Distributor contract

## Local Development

### Install dependencies

```
yarn
```

`postinstall` script should run after installing the dependencies to compile the contracts using Hardhat and generate TypeScript type definitions.

### Run tests

```
yarn test
```

### Run coverage

```
yarn coverage
```

Please keep in mind that Solidity-coverage instruments by injecting statements into the code will increase execution costs, resulting in distorted gas usage simulations. Hence the gas estimation tests are being skipped (marked as pending) when running the coverage.

  1. https://github.com/sc-forks/solidity-coverage/blob/master/docs/faq.md#notes-on-gas-distortion

## Deployment

Pass environment variables via `.env` file or shell. Use `ROPSTEN_` prefix for Ropsten network values as in below examples or `MAINNET_` for Mainnet.

```ini
ROPSTEN_INFURA_API_KEY=infura_api_key
ROPSTEN_PRIVATE_KEY=ropsten_private_key
```

### Token

```ini
ROPSTEN_TOKEN_NAME=Athens
ROPSTEN_TOKEN_SYMBOL=ATH
ROPSTEN_TOKEN_INITIAL_SUPPLY=1000000
```

```
npx hardhat run ./scripts/deploy-token.ts
```

### Merkle Distributor

```ini
ROPSTEN_DISTRIBUTOR_TOKEN=0x123
ROPSTEN_DISTRIBUTOR_MERKLE_ROOT=0x0000000000000000000000000000000000000000000000000000000000000001
ROPSTEN_DISTRIBUTOR_LOCK_TIME=1640991600
```

```
npx hardhat run ./scripts/deploy-merkle-distributor.ts
```
