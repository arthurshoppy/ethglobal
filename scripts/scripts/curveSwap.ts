import { BigNumberish, Contract, providers, utils } from "https://esm.sh/ethers@5.7.0"

const TENDERLY_RPC = "https://rpc.tenderly.co/fork/585c3f21-e380-46fb-b861-efa3f0918dab"

const addr = "0xB4Aa0cCbb67276E08283EF43D7c95132C71A274C"

const provider = new providers.JsonRpcProvider(TENDERLY_RPC)
const signer = provider.getSigner(addr)

function makeErc20(address: string) {
  const erc20 = new Contract(address, ["function approve(address, uint256)", "function balanceOf(address) returns(uint256)"], signer);
  return {
    balanceOf: async (address: string) => await erc20.callStatic.balanceOf(address),
    approve: async (address: string, amount: BigNumberish) => await (await erc20.approve(address, amount)).wait()
  }
}

const Tokens = {
  EURe: makeErc20("0xcB444e90D8198415266c6a2724b7900fb12FC56E"),
  wxDAI: makeErc20("0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d"),
  USDC: makeErc20("0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83")
}

const eureusdPool = new Contract("0xE3FFF29d4DC930EBb787FeCd49Ee5963DADf60b6", [
  "function get_dy_underlying(uint256, uint256, uint256) returns(uint256)",
  "function exchange_underlying(uint256, uint256, uint256, uint256)"
], signer);

enum PoolToken {
  EURe,
  wxDAI,
  USDC
}

async function swap(tokenIn: PoolToken, tokenOut: PoolToken, amountIn: BigNumberish) {
  const dx = await eureusdPool.callStatic.get_dy_underlying(tokenIn, tokenOut, amountIn)
  const slippage = 1000 // 0.1%
  // const gas = await eureusdPool.estimateGas.exchange_underlying(tokenIn, tokenOut, amountIn, dx.sub(dx.div(slippage)))
  const tx = await eureusdPool.exchange_underlying(tokenIn, tokenOut, utils.parseEther("100"), dx.sub(dx.div(slippage))) // { gasLimit: gas.add(1000000) }
  await tx.wait()
}

function formatUnits(value: BigNumberish, decimals = 18, precision = 2) {
  return utils.formatUnits(value, decimals).split('.').map((v, i) => i == 1 ? (v.length > 1 ? v.substring(0, precision) : '00') : v).join(',')
}

async function logBalances() {
  console.log("xDAI: " + formatUnits(await signer.getBalance()))
  console.log("EURe: " + formatUnits(await Tokens.EURe.balanceOf(addr)))
  console.log("wxDAI: " + formatUnits(await Tokens.wxDAI.balanceOf(addr)))
  console.log("USDC: " + formatUnits(await Tokens.USDC.balanceOf(addr), 6))
}



await logBalances()

const amount = utils.parseEther("100")

console.log("Swap")
await Tokens.EURe.approve(eureusdPool.address, amount) // approve the curve pool to use EURe

await swap(PoolToken.EURe, PoolToken.USDC, amount) // swap EURe to USDC with Curve

await logBalances()