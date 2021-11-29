import { program } from 'commander'
import fs from 'fs'
import { BigNumber, utils } from 'ethers'

program
  .requiredOption(
    '-i, --input <path>',
    'input JSON file location containing the merkle proofs for each account and the merkle root'
  )

program.parse(process.argv)

const options = program.opts()

const combinedHash = (first: Buffer, second: Buffer): Buffer => {
  if (!first) {
    return second
  } else if (!second) {
    return first
  }

  return Buffer.from(
    utils.solidityKeccak256(['bytes32', 'bytes32'], [first, second].sort(Buffer.compare)).slice(2),
    'hex'
  )
}

const toNode = (index: number | BigNumber, account: string, amount: BigNumber): Buffer => {
  const pairHex = utils.solidityKeccak256(['uint256', 'address', 'uint256'], [
    index, account, amount
  ])
  return Buffer.from(pairHex.slice(2), 'hex')
}

const verifyProof = (
  index: number | BigNumber,
  account: string,
  amount: BigNumber,
  proof: Buffer[],
  root: Buffer
): boolean => {
  let pair = toNode(index, account, amount)
  for (const item of proof) {
    pair = combinedHash(pair, item)
  }

  return pair.equals(root)
}

const getNextLayer = (elements: Buffer[]): Buffer[] =>
  elements.reduce<Buffer[]>((layer, el, idx, arr) => {
    if (idx % 2 === 0) {
      // Hash the current element with its pair element
      layer.push(combinedHash(el, arr[idx + 1]))
    }
    return layer
  }, [])

const getRoot = (balances: { account: string; amount: BigNumber; index: number }[]): Buffer => {
  let nodes = balances
    .map(({ account, amount, index }) => toNode(index, account, amount))
    // sort by lexicographical order
    .sort(Buffer.compare)

  // deduplicate any elements
  nodes = nodes.filter((el, idx) => {
    return idx === 0 || !nodes[idx - 1].equals(el)
  })

  const layers: Buffer[][] = []
  layers.push(nodes)

  // Get next layer until we reach the root
  while (layers[layers.length - 1].length > 1) {
    layers.push(getNextLayer(layers[layers.length - 1]))
  }

  return layers[layers.length - 1][0]
}

try {
  const input = fs.readFileSync(options.input, 'utf8')
  const json = JSON.parse(input)

  let isValid = true

  const merkleRootHex = json.merkleRoot
  const merkleRoot = Buffer.from(merkleRootHex.slice(2), 'hex')
  const balances: {
    index: number
    account: string
    amount: BigNumber
  }[] = []

  Object.keys(json.claims).forEach((address) => {
    const claim = json.claims[address]
    const proof = claim.proof.map((p: string) => Buffer.from(p.slice(2), 'hex'))

    balances.push({
      index: claim.index,
      account: address,
      amount: BigNumber.from(claim.amount),
    })

    const success = verifyProof(claim.index, address, claim.amount, proof, merkleRoot)
    if (success) {
      console.log(`Verified proof for ${claim.index} ${address}`)
    } else {
      console.log(`Verification for ${address} failed`)
      isValid = false
    }
  })

  if (!isValid) {
    throw new Error('Failed validation for 1 or more proofs')
  }

  const root = getRoot(balances).toString('hex')
  const rootMatches = root === merkleRootHex.slice(2)
  const summedBalances = balances.reduce((sum, balance) => {
    return sum.add(balance.amount)
  }, BigNumber.from(0))

  console.log(`Reconstructed merkle root: 0x${root}`)
  console.log(`Summed balances: ${utils.formatEther(summedBalances)} (${summedBalances})`)

  if (!rootMatches) {
    console.warn('Root does NOT match the one read from the JSON, something might be wrong!')
  } else {
    console.log('Root matches the one read from the JSON, all good')
  }
} catch (err) {
  console.error(err)
  process.exit(1)
}
