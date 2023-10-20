import { SdkConfig } from "@connext/sdk";
import { ethers } from "ethers";

// Create a Signer and connect it to a Provider on the sending chain
import { load } from "https://deno.land/std@0.204.0/dotenv/mod.ts";
const env = await load();
const signer = new ethers.Wallet(env["PRIVATE_KEY"]!);

const signerAddress = await signer.getAddress();

export const Chains={
    gnosis: "https://rpc.gnosis.gateway.fm",
    polygon: "https://polygon.llamarpc.com"
}
export function getSigner(chain:string){
    const provider = new ethers.providers.JsonRpcProvider(chain);
    return signer.connect(provider);
} 


const sdkConfig: SdkConfig = {
  signerAddress: signerAddress,
  // Use `Gnosis mainnet` when you're ready...
  network: "mainnet",
  // Add more chains here! Use mainnet domains if `network: mainnet`. Otherwise `network: testnet`
  // This information can be found at https://docs.connext.network/resources/supported-chains
  chains: {
    1886350457: {
      providers: [Chains.polygon],
    },
    6778479: { 
      providers: [Chains.gnosis],
    },
  },
};

export { signer, sdkConfig };