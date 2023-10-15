import { readable } from "svelte/store";
import {
  ComethWallet,
  ConnectAdaptor,
  SupportedNetworks
} from '@cometh/connect-sdk';
import * as dotenv from 'dotenv';

dotenv.config();

export function createFauxBackendCtx() {

    let walletAdaptor;
    let walletInstance;
    const apiKey = 'f4bbeddb-aa47-4e41-8f34-b7f23d1c7a6b';
    const ctx = {
      
      async createAccount() {
        
        walletAdaptor = new ConnectAdaptor({
          chainId: SupportedNetworks.MUMBAI,
          apiKey,
        });
        
        walletInstance = await new ComethWallet({
          authAdapter: walletAdaptor,
          apiKey,
        });
        

        const localStorageAddress = window.localStorage.getItem("walletAddress");

        if (localStorageAddress) {
          await walletInstance.connect(localStorageAddress);
        } else {
          await walletInstance.connect();
          const walletAddress = await walletInstance.getAddress();
          window.localStorage.setItem("walletAddress", walletAddress)
      }
    },
    //   async initializeAccount() {

    //     await walletInstance.connect(localStorageAddress);
    //   },

    //   async stakeSDAI() {

    //   }
    // async makeTransaction() {
        
    // },
  
    // if (localStorageAddress) {
    //   ctx.createAccount()
    // }

    }
  return ctx
}
