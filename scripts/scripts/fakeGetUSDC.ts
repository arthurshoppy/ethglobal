import { Contract, providers, utils } from "ethers" // https://esm.sh/ethers@5.7.1"

const TENDERLY_RPC = "https://rpc.tenderly.co/fork/9dde55ec-399d-4e86-b64f-a8e5ab033642"

const provider = new providers.JsonRpcProvider(TENDERLY_RPC)
const signer = provider.getSigner("0xB4Aa0cCbb67276E08283EF43D7c95132C71A274C")

const binance = provider.getSigner("0xF977814e90dA44bFA03b6295A0616a897441aceC")

const usdcContract = new Contract("0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", ["function transfer(address, uint256)", "function balanceOf(address) returns(uint256)"]);
const tx = await usdcContract.connect(binance).transfer("0xB4Aa0cCbb67276E08283EF43D7c95132C71A274C", utils.parseUnits("1000", 6))
await tx.wait()

const eure = await usdcContract.connect(signer).callStatic.balanceOf("0xB4Aa0cCbb67276E08283EF43D7c95132C71A274C")
console.log(utils.formatUnits(eure, 6))

