import { create } from "@connext/sdk";
import { BigNumber, utils } from "ethers";
import { getSigner, sdkConfig, Chains } from "./config.ts";

const {sdkBase, sdkUtils} = await create(sdkConfig);

const signer = getSigner(Chains.polygon);

const signerAddress = await signer.getAddress();

// xcall parameters
const originDomain = "1886350457"; // Polygon mainnet
const destinationDomain = "6778479"; // Gnosis mainnet
const originAsset = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"; // USDC on Polygon mainnet see: https://polygonscan.com/address/0x2791bca1f2de4661ed88a30c99a7a9449aa84174 
const amount = utils.parseUnits("1", 6).toString();
const slippage = "10000";

console.log("estimateRelayerFee")
// Estimate the relayer fee

const relayerFeeBn = await sdkBase.estimateRelayerFee({
  originDomain, 
  destinationDomain
})
const relayerFee = relayerFeeBn.add(relayerFeeBn.div(2)).toString()

// Prepare the xcall params
const xcallParams = {
  origin: originDomain,           // send from Polygon
  destination: destinationDomain, // to Gnosis
  to: signerAddress,              // the address that should receive the funds on destination
  asset: originAsset,             // address of the token contract
  delegate: signerAddress,        // address allowed to execute transaction on destination side in addition to relayers
  amount: amount,                 // amount of tokens to transfer
  slippage: slippage,             // the maximum amount of slippage the user will accept in BPS (e.g. 30 = 0.3%)
  callData: "0x",                 // empty calldata for a simple transfer (byte-encoded)
  relayerFee: relayerFee,         // fee paid to relayers 
};

console.log("approveIfNeeded")
// Approve the asset transfer if the current allowance is lower than the amount.
// Necessary because funds will first be sent to the Connext contract in xcall.
const approveTxReq = await sdkBase.approveIfNeeded(
  originDomain,
  originAsset,
  amount
)

if (approveTxReq) {
  console.log("sendTransaction")
  const approveTxReceipt = await signer.sendTransaction(approveTxReq);
  await approveTxReceipt.wait();
}

console.log("xcall")
// Send the xcall
const xcallTxReq = await sdkBase.xcall(xcallParams);
xcallTxReq.gasLimit = BigNumber.from("10000000");

const gasFee = await signer.provider.getGasPrice()
xcallTxReq.maxFeePerGas = gasFee.mul(2)
xcallTxReq.maxPriorityFeePerGas = gasFee.mul(2)

console.log("sendTransactionTwo")
const xcallTxReceipt = await signer.sendTransaction(xcallTxReq);
console.log(xcallTxReceipt);
await xcallTxReceipt.wait();
console.log("xcall sent: " + xcallTxReceipt.hash)

await (new Promise(r => {
  setInterval(async () => {
    const transfers = await sdkUtils.getTransfers({ 
      transactionHash: xcallTxReceipt.hash
    })
    if (transfers[0]?.status === "Executed") {
      r(undefined)
    }
  }, 25_000)
}))
console.log("Bridged")