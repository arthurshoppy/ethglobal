import { writable } from 'svelte/store';
import {
  ComethWallet,
  ConnectAdaptor,
  SupportedNetworks
} from '@cometh/connect-sdk';

export function createFauxBackendCtx() {

  let walletAdaptor: ConnectAdaptor;
  let walletInstance: ComethWallet;

  const ctx = {
  
		address: writable<string | null>(null),

		async createAccount() {
			
			walletAdaptor = new ConnectAdaptor({
				chainId: SupportedNetworks.MUMBAI,
				apiKey: import.meta.env.VITE_COMMETH,
			});
			
			walletInstance = await new ComethWallet({
				authAdapter: walletAdaptor,
				apiKey: import.meta.env.VITE_COMMETH,
			});
			
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

  // const localStorageAddress = window.localStorage.getItem("walletAddress");

  // if (localStorageAddress) {
  //   await walletInstance.connect(localStorageAddress);
  // } else {
  //   await walletInstance.connect();
  //   const walletAddress = await walletInstance.getAddress();
  //   window.localStorage.setItem("walletAddress", walletAddress)
  // }

  return ctx
}
