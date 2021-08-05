// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract Governance is Initializable, ERC20Upgradeable {
    function initialize(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        address owner
    ) public virtual initializer {
        __Governance_init(name, symbol, initialSupply, owner);
    }

    /**
     * @dev Mints `initialSupply` amount of token and transfers them to `owner`.
     *
     * See {ERC20-constructor}.
     */
    function __Governance_init(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        address owner
    ) internal initializer {
        __Context_init_unchained();
        __ERC20_init_unchained(name, symbol);
        __Governance_init_unchained(name, symbol, initialSupply, owner);
    }

    function __Governance_init_unchained(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        address owner
    ) internal initializer {
        _mint(owner, initialSupply);
    }
    uint256[50] private __gap;
}
