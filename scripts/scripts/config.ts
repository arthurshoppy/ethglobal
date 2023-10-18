import { SdkConfig } from "@connext/sdk";
import { ethers } from "ethers";

// Create a Signer and connect it to a Provider on the sending chain
const privateKey = "2b45724a63ac8ca411560d48b9587bf3a9081c90d913290a0c6cc231bd9a80fb";

let signer = new ethers.Wallet(privateKey);

// Use the RPC url for the origin chain
// TENDERLY_RPC_GNOSIS
const provider = new ethers.providers.JsonRpcProvider("https://rpc.gnosis.gateway.fm"); // gnosis
signer = signer.connect(provider);
const signerAddress = await signer.getAddress();

const sdkConfig: SdkConfig = {
  signerAddress: signerAddress,
  // Use `Gnosis mainnet` when you're ready...
  network: "mainnet",
  // Add more chains here! Use mainnet domains if `network: mainnet`. Otherwise `network: testnet`
  // This information can be found at https://docs.connext.network/resources/supported-chains
  chains: {
    6778479: { // Gnosis mainnet domain ID
      providers: ["https://rpc.gnosis.gateway.fm"],
    },
    1886350457: { // Polygon mainnet domain ID
      providers: ["https://polygon-rpc.com"],
    },
  },
};

export { signer, sdkConfig };