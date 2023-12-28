/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type {
  Signer,
  BytesLike,
  BigNumberish,
  AddressLike,
  ContractDeployTransaction,
  ContractRunner,
} from "ethers";
import type { NonPayableOverrides } from "../../common";
import type {
  MerkleDistributor,
  MerkleDistributorInterface,
} from "../../contracts/MerkleDistributor";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "token_",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "merkleRoot_",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "lockTime_",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
      {
        indexed: false,
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
    name: "Claimed",
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
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Recovered",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "bytes32[]",
        name: "merkleProof",
        type: "bytes32[]",
      },
    ],
    name: "claim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "isClaimed",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "lockTime",
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
    name: "merkleRoot",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
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
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "recover",
    outputs: [],
    stateMutability: "nonpayable",
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
    name: "token",
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
] as const;

const _bytecode =
  "0x60e060405234801561001057600080fd5b50604051610fec380380610fec83398101604081905261002f9161019d565b6100383361014d565b6001600160a01b0383166100935760405162461bcd60e51b815260206004820152601e60248201527f546f6b656e206d757374206265206e6f6e2d7a65726f2061646472657373000060448201526064015b60405180910390fd5b816100e05760405162461bcd60e51b815260206004820152601c60248201527f4d65726b6c6520726f6f74206d757374206265206e6f6e2d7a65726f00000000604482015260640161008a565b80421061012f5760405162461bcd60e51b815260206004820152601f60248201527f4c6f636b2074696d65206d75737420626520696e207468652066757475726500604482015260640161008a565b60609290921b6001600160601b03191660805260a05260c0526101de565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6000806000606084860312156101b1578283fd5b83516001600160a01b03811681146101c7578384fd5b602085015160409095015190969495509392505050565b60805160601c60a05160c051610dba6102326000396000818160c2015281816101df015261045501526000818161010f015261062c0152600081816101b30152818161029301526107120152610dba6000f3fe608060405234801561001057600080fd5b50600436106100a35760003560e01c8063715018a6116100765780639e34070f1161005b5780639e34070f14610178578063f2fde38b1461019b578063fc0c546a146101ae57600080fd5b8063715018a6146101315780638da5cb5b1461013957600080fd5b80630ca35682146100a85780630d668087146100bd5780632e7ba6ef146100f75780632eb4a7ab1461010a575b600080fd5b6100bb6100b6366004610c4e565b6101d5565b005b6100e47f000000000000000000000000000000000000000000000000000000000000000081565b6040519081526020015b60405180910390f35b6100bb610105366004610c66565b610453565b6100e47f000000000000000000000000000000000000000000000000000000000000000081565b6100bb610878565b60005473ffffffffffffffffffffffffffffffffffffffff165b60405173ffffffffffffffffffffffffffffffffffffffff90911681526020016100ee565b61018b610186366004610c4e565b610900565b60405190151581526020016100ee565b6100bb6101a9366004610c14565b610941565b6101537f000000000000000000000000000000000000000000000000000000000000000081565b6101dd6109f8565b7f00000000000000000000000000000000000000000000000000000000000000004211610291576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603d60248201527f4d65726b6c654469737472696275746f723a2043616e6e6f74207265636f766560448201527f722074686520746f6b656e73206265666f7265206c6f636b2074696d6500000060648201526084015b60405180910390fd5b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663a9059cbb6102ec60005473ffffffffffffffffffffffffffffffffffffffff1690565b6040517fffffffff0000000000000000000000000000000000000000000000000000000060e084901b16815273ffffffffffffffffffffffffffffffffffffffff909116600482015260248101849052604401602060405180830381600087803b15801561035957600080fd5b505af115801561036d573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103919190610c2e565b61041d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602260248201527f4d65726b6c654469737472696275746f723a205265636f76657279206661696c60448201527f65640000000000000000000000000000000000000000000000000000000000006064820152608401610288565b6040518181527f32e95f921f72e9e736ccad1cc1c0ef6e3c3c08204eb74e9ee4ae8f98e195e3f09060200160405180910390a150565b7f0000000000000000000000000000000000000000000000000000000000000000421115610503576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602f60248201527f4d65726b6c654469737472696275746f723a2043616e6e6f7420636c61696d2060448201527f6166746572206c6f636b2074696d6500000000000000000000000000000000006064820152608401610288565b61050c85610900565b15610599576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602760248201527f4d65726b6c654469737472696275746f723a2044726f7020616c72656164792060448201527f636c61696d6564000000000000000000000000000000000000000000000000006064820152608401610288565b60408051602081018790527fffffffffffffffffffffffffffffffffffffffff000000000000000000000000606087901b1691810191909152605481018490526000906074016040516020818303038152906040528051906020012090506106578383808060200260200160405190810160405280939291908181526020018383602002808284376000920191909152507f00000000000000000000000000000000000000000000000000000000000000009250859150610a7b9050565b6106bd576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820181905260248201527f4d65726b6c654469737472696275746f723a20496e76616c69642070726f6f666044820152606401610288565b6106c686610a91565b6040517fa9059cbb00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff8681166004830152602482018690527f0000000000000000000000000000000000000000000000000000000000000000169063a9059cbb90604401602060405180830381600087803b15801561075657600080fd5b505af115801561076a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061078e9190610c2e565b61081a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602260248201527f4d65726b6c654469737472696275746f723a205472616e73666572206661696c60448201527f65640000000000000000000000000000000000000000000000000000000000006064820152608401610288565b6040805187815273ffffffffffffffffffffffffffffffffffffffff871660208201529081018590527f4ec90e965519d92681267467f775ada5bd214aa92c0dc93d90a5e880ce9ed0269060600160405180910390a1505050505050565b6040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603660248201527f4d65726b6c654469737472696275746f723a2052656e6f756e63696e6720746860448201527f65206f776e65727368697020646973616c6c6f776564000000000000000000006064820152608401610288565b60008061090f61010084610cf8565b9050600061091f61010085610d6a565b60009283526001602081905260409093205492901b9182169091149392505050565b6109496109f8565b73ffffffffffffffffffffffffffffffffffffffff81166109ec576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f64647265737300000000000000000000000000000000000000000000000000006064820152608401610288565b6109f581610ad0565b50565b60005473ffffffffffffffffffffffffffffffffffffffff163314610a79576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610288565b565b600082610a888584610b45565b14949350505050565b6000610a9f61010083610cf8565b90506000610aaf61010084610d6a565b600092835260016020819052604090932080549390911b9092179091555050565b6000805473ffffffffffffffffffffffffffffffffffffffff8381167fffffffffffffffffffffffff0000000000000000000000000000000000000000831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b600081815b8451811015610bb157610b9d82868381518110610b90577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b6020026020010151610bb9565b915080610ba981610d0c565b915050610b4a565b509392505050565b6000818310610bd5576000828152602084905260409020610be4565b60008381526020839052604090205b9392505050565b803573ffffffffffffffffffffffffffffffffffffffff81168114610c0f57600080fd5b919050565b600060208284031215610c25578081fd5b610be482610beb565b600060208284031215610c3f578081fd5b81518015158114610be4578182fd5b600060208284031215610c5f578081fd5b5035919050565b600080600080600060808688031215610c7d578081fd5b85359450610c8d60208701610beb565b935060408601359250606086013567ffffffffffffffff80821115610cb0578283fd5b818801915088601f830112610cc3578283fd5b813581811115610cd1578384fd5b8960208260051b8501011115610ce5578384fd5b9699959850939650602001949392505050565b600082610d0757610d07610d7e565b500490565b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff821415610d63577f4e487b710000000000000000000000000000000000000000000000000000000081526011600452602481fd5b5060010190565b600082610d7957610d79610d7e565b500690565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fdfea164736f6c6343000804000a";

type MerkleDistributorConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MerkleDistributorConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class MerkleDistributor__factory extends ContractFactory {
  constructor(...args: MerkleDistributorConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    token_: AddressLike,
    merkleRoot_: BytesLike,
    lockTime_: BigNumberish,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(
      token_,
      merkleRoot_,
      lockTime_,
      overrides || {}
    );
  }
  override deploy(
    token_: AddressLike,
    merkleRoot_: BytesLike,
    lockTime_: BigNumberish,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(
      token_,
      merkleRoot_,
      lockTime_,
      overrides || {}
    ) as Promise<
      MerkleDistributor & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): MerkleDistributor__factory {
    return super.connect(runner) as MerkleDistributor__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MerkleDistributorInterface {
    return new Interface(_abi) as MerkleDistributorInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): MerkleDistributor {
    return new Contract(address, _abi, runner) as unknown as MerkleDistributor;
  }
}
