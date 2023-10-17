import { writable } from 'svelte/store';
import {
  ComethProvider,
  ComethWallet,
  ConnectAdaptor,
  SupportedNetworks
} from '@cometh/connect-sdk';
import { cachedStore } from '../helpers/reactivity-helpers';

export function createFauxBackendCtx() {

  let walletAdaptor: ConnectAdaptor;
  let walletInstance: ComethWallet;
  let sDAIMainnetContract = '0x83F20F44975D03b1b09e64809B757c47f942BEeA';
  let sDAIChiadoContract = '0x20e5eB701E8d711D419D444814308f8c2243461F';
  let provider: ComethProvider;

  const ctx = {
  
		address: cachedStore(writable<string | null>(null)),

		async createAccount() {
			
			walletAdaptor = new ConnectAdaptor({
				chainId: SupportedNetworks.CHIADO,
				apiKey: import.meta.env.VITE_COMMETH,
			});
			
			walletInstance = await new ComethWallet({
				authAdapter: walletAdaptor,
				apiKey: import.meta.env.VITE_COMMETH,
			});
      
		},

    //   async initializeAccount() {
    //    await walletInstance.connect(localStorageAddress);
    //   },

      async stakeSDAI(amount: number, ) {
        const value = amount;
        provider = new ComethProvider(walletInstance);
       
        const txValues =  {
          to: sDAIMainnetContract, //deposit xDAI for sDAI
          value: "0x00", //User Input
          data: "0x", // Calldata
        };
        
        const tx = await walletInstance.sendTransaction(txValues);
        const txPending = await provider.getTransaction(tx.safeTxHash);
        await txPending.wait();
    },

    async testTransaction() {
      const txValues =  {
        to: sDAIMainnetContract, //deposit xDAI for sDAI
        value: "0x00", //User Input
        data: "0x", // Calldata
      };
      
      const tx = await walletInstance.sendTransaction(txValues);
      const txPending = await provider.getTransaction(tx.safeTxHash);
      await txPending.wait();
    },
  
    async unstakeSDAI() {
      const txValues =  {
        to: sDAIMainnetContract, //withdraw xDAI for sDAI
        value: "0x00", //User Input
        data: "0x", // Calldata for function unstake/withdraw
      };
      
      const tx = await walletInstance.sendTransaction(txValues);
      const txPending = await provider.getTransaction(tx.safeTxHash);
      await txPending.wait();
  },
      
    async makeSwapAndDeposit() {
      provider = new ComethProvider(walletInstance);
      const txValues = [{
        to: "targetAddress2", //make a swap to ETH to xDAI(if we build it with EURe)
        value: "0x00", //User Input
        data: "0x", //Calldata of the tx
      }, {
        to: sDAIMainnetContract, //deposit xDAI for sDAI
        value: "0x00", //User Input
        data: "0x", //
      }];
           

      const txBatch = await walletInstance.sendBatchTransactions(txValues);
      const txPending = await provider.getTransaction(txBatch.safeTxHash);
      await txPending.wait();
    },
  
    // if (localStorageAddress) {
    //   ctx.createAccount()
    // }

    async createWallet() {
        
      const localStorageAddress = window.localStorage.getItem("walletAddress");

        if (localStorageAddress) {
        await walletInstance.connect(localStorageAddress);
        } else {
        await walletInstance.connect();
        const walletAddress = await walletInstance.getAddress();
        window.localStorage.setItem("walletAddress", walletAddress)
        }
      },
    }

  return ctx
}