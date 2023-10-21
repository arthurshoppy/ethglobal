import { BigNumberish, Contract, providers, utils, Wallet } from "https://esm.sh/ethers@5.7.0"

const w = new Wallet("0xea5c67db7468512498ad34230c5c6f4ed82f2347e9578001236f0bcc14392a24", new providers.JsonRpcProvider("https://rpc.gnosis.gateway.fm"))

console.log(await w.getAddress())
console.log(utils.formatEther(await w.getBalance()))