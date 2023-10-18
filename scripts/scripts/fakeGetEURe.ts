import { Contract, providers, utils } from "ethers" // https://esm.sh/ethers@5.7.1"

const TENDERLY_RPC = "https://rpc.tenderly.co/fork/585c3f21-e380-46fb-b861-efa3f0918dab"

const provider = new providers.JsonRpcProvider(TENDERLY_RPC)
const signer = provider.getSigner("0xB4Aa0cCbb67276E08283EF43D7c95132C71A274C")

const eureVault = provider.getSigner("0xBA12222222228d8Ba445958a75a0704d566BF2C8")

const eureContract = new Contract("0xcB444e90D8198415266c6a2724b7900fb12FC56E", ["function transfer(address, uint256)", "function balanceOf(address) returns(uint256)"]);
const tx = await eureContract.connect(eureVault).transfer("0xB4Aa0cCbb67276E08283EF43D7c95132C71A274C", utils.parseUnits("1000", 18))
await tx.wait()

const eure = await eureContract.connect(signer).callStatic.balanceOf("0xB4Aa0cCbb67276E08283EF43D7c95132C71A274C")
console.log(utils.formatUnits(eure, 18))

