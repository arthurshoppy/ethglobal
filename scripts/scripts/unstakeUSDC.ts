import { BigNumberish, Contract, providers, utils } from "https://esm.sh/ethers@5.7.0"

const TENDERLY_RPC = "https://rpc.tenderly.co/fork/9dde55ec-399d-4e86-b64f-a8e5ab033642" // poly

const addr = "0xB4Aa0cCbb67276E08283EF43D7c95132C71A274C" // TODO add user address

const provider = new providers.JsonRpcProvider(TENDERLY_RPC)
const signer = provider.getSigner(addr)

function formatUnits(value: BigNumberish, decimals = 18, precision = 2) {
  return utils.formatUnits(value, decimals).split('.').map((v, i) => i == 1 ? (v.length > 1 ? v.substring(0, precision) : '00') : v).join(',')
}

function makeErc20(address: string) {
  const erc20 = new Contract(address, ["function approve(address, uint256)", "function balanceOf(address) returns(uint256)"], signer);
  return {
    address,
    balanceOf: async (address: string) => await erc20.callStatic.balanceOf(address),
    approve: async (address: string, amount: BigNumberish) => await (await erc20.approve(address, amount)).wait()
  }
}

const Tokens = {
  USDC: makeErc20("0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"),
  cUSDC: makeErc20("0xF25212E676D1F7F89Cd72fFEe66158f541246445")
}

async function logBalances() {
  console.log("USDC: " + formatUnits(await Tokens.USDC.balanceOf(addr), 6))
  console.log("cUSDC: " + formatUnits(await Tokens.cUSDC.balanceOf(addr), 6))
}


await logBalances()
const amount = utils.parseUnits("32", 6)
console.log("Deposit")

// get contract
const CompoundContract = new Contract(Tokens.cUSDC.address, ["function withdraw(address, uint256)"], signer);

//unstake cUSDC
const tx = await CompoundContract.withdraw(Tokens.USDC.address, amount)

await tx.wait()
await logBalances()