import { ethers, Wallet, providers } from "ethers" // https://esm.sh/ethers@5.7.1"
import Safe, { EthersAdapter, SafeFactory } from "npm:@safe-global/protocol-kit@1.3.0" // 'https://esm.sh/@safe-global/protocol-kit@1.3.0'
import SafeApiKit from 'https://esm.sh/@safe-global/api-kit@1.3.1'
// import { Web3AuthModalPack, Web3AuthConfig, AuthKitSignInData } from 'https://esm.sh/@safe-global/auth-kit@1.2.0'

const TENDERLY_RPC = "https://rpc.tenderly.co/fork/5f52445c-892f-498a-8bbd-dc3792b5f206"

export async function getSafe() {
  const provider = new providers.JsonRpcProvider(TENDERLY_RPC)
  const signer = provider.getSigner("0xB4Aa0cCbb67276E08283EF43D7c95132C71A274C")

  const userSigner = Wallet.createRandom().connect(provider)

  const ethAdapter = new EthersAdapter({
    // deno-lint-ignore no-explicit-any
    ethers: ethers as any, // This should be 5.7.0 but its 6.8.0...
    signerOrProvider: signer
  })

  const safeFactory = await SafeFactory.create({ ethAdapter, isL1SafeMasterCopy: true })

  const safeSdk = await safeFactory.deploySafe({ 
    safeAccountConfig: {
      owners: [await userSigner.getAddress()],
      threshold: 1
    },
    options: {
      from: await signer.getAddress()
    }
  })

  const safeAddress = await safeSdk.getAddress()
  console.log(safeAddress)

  // const txServiceUrl = TENDERLY_RPC // 'https://safe-transaction-goerli.safe.global'
  // const safeService = new SafeApiKit({ txServiceUrl, ethAdapter })
}

getSafe()