/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../common";
import type {
  Athens,
  AthensInterface,
} from "../../../contracts/Governance.sol/Athens";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "TokenLocked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "TokenUnlocked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "name_",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol_",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "initialSupply_",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "owner_",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "lock",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "lockedBalanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "recipients",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "values",
        type: "uint256[]",
      },
    ],
    name: "transfers",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "unlock",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "unlockedBalanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b50611ce2806100206000396000f3fe608060405234801561001057600080fd5b506004361061016c5760003560e01c8063715018a6116100cd578063a9059cbb11610081578063dd46706411610066578063dd467064146102fb578063dd62ed3e1461030e578063f2fde38b1461035457600080fd5b8063a9059cbb146102d5578063bd3a13f6146102e857600080fd5b80638da5cb5b116100b25780638da5cb5b1461029257806395d89b41146102ba578063a457c2d7146102c257600080fd5b8063715018a61461027557806384955c881461027f57600080fd5b806339509351116101245780635935573611610109578063593557361461020c5780636198e3391461022c57806370a082311461023f57600080fd5b806339509351146101e657806352346412146101f957600080fd5b806318160ddd1161015557806318160ddd146101b257806323b872dd146101c4578063313ce567146101d757600080fd5b806306fdde0314610171578063095ea7b31461018f575b600080fd5b610179610367565b6040516101869190611ad7565b60405180910390f35b6101a261019d36600461195a565b6103f9565b6040519015158152602001610186565b6067545b604051908152602001610186565b6101a26101d236600461191f565b610411565b60405160128152602001610186565b6101a26101f436600461195a565b610569565b6101a2610207366004611983565b6105b5565b6101b661021a3660046118d3565b60976020526000908152604090205481565b6101a261023a366004611abf565b6106f1565b6101b661024d3660046118d3565b73ffffffffffffffffffffffffffffffffffffffff1660009081526065602052604090205490565b61027d61080b565b005b6101b661028d3660046118d3565b61081f565b60335460405173ffffffffffffffffffffffffffffffffffffffff9091168152602001610186565b610179610860565b6101a26102d036600461195a565b61086f565b6101a26102e336600461195a565b61094b565b61027d6102f6366004611a44565b610a9c565b6101a2610309366004611abf565b610cc3565b6101b661031c3660046118ed565b73ffffffffffffffffffffffffffffffffffffffff918216600090815260666020908152604080832093909416825291909152205490565b61027d6103623660046118d3565b610deb565b60606068805461037690611bea565b80601f01602080910402602001604051908101604052809291908181526020018280546103a290611bea565b80156103ef5780601f106103c4576101008083540402835291602001916103ef565b820191906000526020600020905b8154815290600101906020018083116103d257829003601f168201915b5050505050905090565b600033610407818585610ea2565b5060019392505050565b60008161041d8561081f565b10156104b0576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603360248201527f417468656e733a204e6f7420656e6f75676820756e6c6f636b656420746f6b6560448201527f6e2062616c616e6365206f662073656e6465720000000000000000000000000060648201526084015b60405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff8316301415610556576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602d60248201527f417468656e733a205472616e736665727320746f2074686520636f6e7472616360448201527f74206e6f7420616c6c6f7765640000000000000000000000000000000000000060648201526084016104a7565b610561848484611055565b949350505050565b33600081815260666020908152604080832073ffffffffffffffffffffffffffffffffffffffff8716845290915281205490919061040790829086906105b0908790611bbb565b610ea2565b60008151835114610648576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602260248201527f417468656e733a20496e707574206c656e6774687320646f206e6f74206d617460448201527f636800000000000000000000000000000000000000000000000000000000000060648201526084016104a7565b60005b8351811015610407576106de848281518110610690577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b60200260200101518483815181106106d1577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b602002602001015161094b565b50806106e981611c3e565b91505061064b565b3360008181526097602052604081205490919083111561076d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820181905260248201527f417468656e733a204e6f7420656e6f756768206c6f636b656420746f6b656e7360448201526064016104a7565b73ffffffffffffffffffffffffffffffffffffffff811660009081526097602052604090205461079e908490611bd3565b73ffffffffffffffffffffffffffffffffffffffff8216600081815260976020526040908190209290925590517f613edbda9d1e6bda8af8e869a973f88cccf93854a11f351589038de07e1ab4e3906107fa9086815260200190565b60405180910390a250600192915050565b61081361106e565b61081d60006110ef565b565b73ffffffffffffffffffffffffffffffffffffffff8116600090815260976020908152604080832054606590925282205461085a9190611bd3565b92915050565b60606069805461037690611bea565b33600081815260666020908152604080832073ffffffffffffffffffffffffffffffffffffffff8716845290915281205490919083811015610933576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f7760448201527f207a65726f00000000000000000000000000000000000000000000000000000060648201526084016104a7565b6109408286868403610ea2565b506001949350505050565b6000816109573361081f565b10156109e5576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602960248201527f417468656e733a204e6f7420656e6f75676820756e6c6f636b656420746f6b6560448201527f6e2062616c616e6365000000000000000000000000000000000000000000000060648201526084016104a7565b73ffffffffffffffffffffffffffffffffffffffff8316301415610a8b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602d60248201527f417468656e733a205472616e736665727320746f2074686520636f6e7472616360448201527f74206e6f7420616c6c6f7765640000000000000000000000000000000000000060648201526084016104a7565b610a958383611166565b9392505050565b600054610100900460ff1615808015610abc5750600054600160ff909116105b80610ad65750303b158015610ad6575060005460ff166001145b610b62576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201527f647920696e697469616c697a656400000000000000000000000000000000000060648201526084016104a7565b600080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff001660011790558015610bc057600080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00ff166101001790555b73ffffffffffffffffffffffffffffffffffffffff8216610c3d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601e60248201527f4f776e6572206d757374206265206e6f6e2d7a65726f2061646472657373000060448201526064016104a7565b610c45611174565b610c4f8585611214565b610c5982846112d7565b8015610cbc57600080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00ff169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b5050505050565b60003382610cd08261081f565b1015610d5e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602260248201527f417468656e733a204e6f7420656e6f75676820756e6c6f636b656420746f6b6560448201527f6e7300000000000000000000000000000000000000000000000000000000000060648201526084016104a7565b73ffffffffffffffffffffffffffffffffffffffff8116600090815260976020526040902054610d8f908490611bbb565b73ffffffffffffffffffffffffffffffffffffffff8216600081815260976020526040908190209290925590517ff9626bca62c59d77fa45a204dc096874ee066a5c5e124aa9ce6c438dbdf7387a906107fa9086815260200190565b610df361106e565b73ffffffffffffffffffffffffffffffffffffffff8116610e96576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f646472657373000000000000000000000000000000000000000000000000000060648201526084016104a7565b610e9f816110ef565b50565b73ffffffffffffffffffffffffffffffffffffffff8316610f44576040517f08c379a0000000000000000000000000000000000000000000000000000000008152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f2061646460448201527f726573730000000000000000000000000000000000000000000000000000000060648201526084016104a7565b73ffffffffffffffffffffffffffffffffffffffff8216610fe7576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f20616464726560448201527f737300000000000000000000000000000000000000000000000000000000000060648201526084016104a7565b73ffffffffffffffffffffffffffffffffffffffff83811660008181526066602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b6000336110638582856113cc565b6109408585856114a3565b60335473ffffffffffffffffffffffffffffffffffffffff16331461081d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016104a7565b6033805473ffffffffffffffffffffffffffffffffffffffff8381167fffffffffffffffffffffffff0000000000000000000000000000000000000000831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b6000336104078185856114a3565b600054610100900460ff1661120b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602b60248201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960448201527f6e697469616c697a696e6700000000000000000000000000000000000000000060648201526084016104a7565b61081d336110ef565b600054610100900460ff166112ab576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602b60248201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960448201527f6e697469616c697a696e6700000000000000000000000000000000000000000060648201526084016104a7565b81516112be906068906020850190611719565b5080516112d2906069906020840190611719565b505050565b73ffffffffffffffffffffffffffffffffffffffff8216611354576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f20616464726573730060448201526064016104a7565b80606760008282546113669190611bbb565b909155505073ffffffffffffffffffffffffffffffffffffffff82166000818152606560209081526040808320805486019055518481527fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a35050565b73ffffffffffffffffffffffffffffffffffffffff8381166000908152606660209081526040808320938616835292905220547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff811461149d5781811015611490576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e636500000060448201526064016104a7565b61149d8484848403610ea2565b50505050565b73ffffffffffffffffffffffffffffffffffffffff8316611546576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f20616460448201527f647265737300000000000000000000000000000000000000000000000000000060648201526084016104a7565b73ffffffffffffffffffffffffffffffffffffffff82166115e9576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201527f657373000000000000000000000000000000000000000000000000000000000060648201526084016104a7565b73ffffffffffffffffffffffffffffffffffffffff83166000908152606560205260409020548181101561169f576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e742065786365656473206260448201527f616c616e6365000000000000000000000000000000000000000000000000000060648201526084016104a7565b73ffffffffffffffffffffffffffffffffffffffff80851660008181526065602052604080822086860390559286168082529083902080548601905591517fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9061170c9086815260200190565b60405180910390a361149d565b82805461172590611bea565b90600052602060002090601f016020900481019282611747576000855561178d565b82601f1061176057805160ff191683800117855561178d565b8280016001018555821561178d579182015b8281111561178d578251825591602001919060010190611772565b5061179992915061179d565b5090565b5b80821115611799576000815560010161179e565b803573ffffffffffffffffffffffffffffffffffffffff811681146117d657600080fd5b919050565b600082601f8301126117eb578081fd5b813560206118006117fb83611b97565b611b48565b80838252828201915082860187848660051b890101111561181f578586fd5b855b8581101561183d57813584529284019290840190600101611821565b5090979650505050505050565b600082601f83011261185a578081fd5b813567ffffffffffffffff81111561187457611874611ca6565b6118a560207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f84011601611b48565b8181528460208386010111156118b9578283fd5b816020850160208301379081016020019190915292915050565b6000602082840312156118e4578081fd5b610a95826117b2565b600080604083850312156118ff578081fd5b611908836117b2565b9150611916602084016117b2565b90509250929050565b600080600060608486031215611933578081fd5b61193c846117b2565b925061194a602085016117b2565b9150604084013590509250925092565b6000806040838503121561196c578182fd5b611975836117b2565b946020939093013593505050565b60008060408385031215611995578182fd5b823567ffffffffffffffff808211156119ac578384fd5b818501915085601f8301126119bf578384fd5b813560206119cf6117fb83611b97565b8083825282820191508286018a848660051b89010111156119ee578889fd5b8896505b84871015611a1757611a03816117b2565b8352600196909601959183019183016119f2565b5096505086013592505080821115611a2d578283fd5b50611a3a858286016117db565b9150509250929050565b60008060008060808587031215611a59578081fd5b843567ffffffffffffffff80821115611a70578283fd5b611a7c8883890161184a565b95506020870135915080821115611a91578283fd5b50611a9e8782880161184a565b93505060408501359150611ab4606086016117b2565b905092959194509250565b600060208284031215611ad0578081fd5b5035919050565b6000602080835283518082850152825b81811015611b0357858101830151858201604001528201611ae7565b81811115611b145783604083870101525b50601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016929092016040019392505050565b604051601f82017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016810167ffffffffffffffff81118282101715611b8f57611b8f611ca6565b604052919050565b600067ffffffffffffffff821115611bb157611bb1611ca6565b5060051b60200190565b60008219821115611bce57611bce611c77565b500190565b600082821015611be557611be5611c77565b500390565b600181811c90821680611bfe57607f821691505b60208210811415611c38577f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b50919050565b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff821415611c7057611c70611c77565b5060010190565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fdfea164736f6c6343000804000a";

type AthensConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: AthensConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Athens__factory extends ContractFactory {
  constructor(...args: AthensConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      Athens & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): Athens__factory {
    return super.connect(runner) as Athens__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): AthensInterface {
    return new Interface(_abi) as AthensInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): Athens {
    return new Contract(address, _abi, runner) as unknown as Athens;
  }
}