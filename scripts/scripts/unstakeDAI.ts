import { BigNumberish, Contract, providers, utils } from "https://esm.sh/ethers@5.7.0"

const TENDERLY_RPC = "https://rpc.tenderly.co/fork/585c3f21-e380-46fb-b861-efa3f0918dab"

const addr = "0xB4Aa0cCbb67276E08283EF43D7c95132C71A274C"

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
  EURe: makeErc20("0xcB444e90D8198415266c6a2724b7900fb12FC56E"),
  wxDAI: makeErc20("0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d"),
  sDAI: makeErc20("0xaf204776c7245bF4147c2612BF6e5972Ee483701")
}

async function logBalances() {
  console.log("xDAI: " + formatUnits(await signer.getBalance()))
  console.log("EURe: " + formatUnits(await Tokens.EURe.balanceOf(addr)))
  console.log("wxDAI: " + formatUnits(await Tokens.wxDAI.balanceOf(addr)))
  console.log("sDAI: " + formatUnits(await Tokens.sDAI.balanceOf(addr)))
}


await logBalances()

const sDAI = new Contract(Tokens.sDAI.address, [
  "function maxRedeem(address) view returns(uint256)",
  "function redeem(uint256, address, address) external"
], signer);

const maxRedeem = await sDAI.callStatic.maxRedeem(await signer.getAddress())
const tx = await sDAI.redeem(maxRedeem, await signer.getAddress(), await signer.getAddress())
await tx.wait()

await logBalances()