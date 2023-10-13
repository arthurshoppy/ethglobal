
import { ethers, Wallet } from "https://esm.sh/ethers@5.7.0"
import { EthersAdapter, SafeFactory } from 'https://esm.sh/@safe-global/protocol-kit@1.3.0'
import { Web3AuthModalPack, Web3AuthConfig, AuthKitSignInData } from 'https://esm.sh/@safe-global/auth-kit@1.2.0'

export async function getSafe() {
  const wallet = Wallet.createRandom()

  const ethAdapter = new EthersAdapter({
    // deno-lint-ignore no-explicit-any
    ethers: ethers as any, // This should be 5.7.0 but its 6.8.0...
    signerOrProvider: wallet
  })

  const safeFactory = await SafeFactory.create({ ethAdapter })


}