import { Contract, providers, utils } from "https://esm.sh/ethers@5.7.0"
const TENDERLY_RPC_GNOSIS = "https://rpc.tenderly.co/fork/585c3f21-e380-46fb-b861-efa3f0918dab" // gnosis xDai
const TENDERLY_RPC_POLYGON = "https://rpc.tenderly.co/fork/9dde55ec-399d-4e86-b64f-a8e5ab033642" //  polygon 
const providerGnosis = new providers.JsonRpcProvider(TENDERLY_RPC_GNOSIS)
const providerPolygon = new providers.JsonRpcProvider(TENDERLY_RPC_POLYGON)
const signer = providerGnosis.getSigner("0xBda25FE2140C12D0596ffaEeDb5Fe296f14259bA") // gnosis
// const signer = providerPolygon.getSigner("") // make one for polygon

const balance = await signer.getBalance()

console.log(utils.formatUnits(balance, 18))

const bridge = new Contract("0x056C6C5e684CeC248635eD86033378Cc444459B0", [
    "function get_dy(uint256, uint256, uint256) returns(uint256)",
    "function balanceOf(address) returns(uint256)"
  ], signer);