import { writable } from 'svelte/store'
import {
  ComethProvider,
  ComethWallet,
  ConnectAdaptor,
  SupportedNetworks
} from '@cometh/connect-sdk';
import { cachedStore } from '../helpers/reactivity-helpers';
import { type BigNumberish, Contract, utils } from "ethers"
import {sDAIabi} from '../shared/abis/sDAIabi'

enum PoolToken {
  EURe,
  wxDAI,
  USDC
}

export function createFauxBackendCtx() {

  let walletAdaptor: ConnectAdaptor;
  let walletInstance: ComethWallet;
  let sDAIMainnetContract = '0x83F20F44975D03b1b09e64809B757c47f942BEeA';
  let sDAIChiadoContract = '0x20e5eB701E8d711D419D444814308f8c2243461F';
  let provider: ComethProvider;
  let localStorageAddress: any;

  const ctx = {
    
    address: cachedStore(writable<string | null>(null)),
    
		async initializeWallet() {
      walletAdaptor = new ConnectAdaptor({
        chainId: SupportedNetworks.CHIADO,
				apiKey: import.meta.env.VITE_COMMETH_CHIADO,
			});
			
			walletInstance = await new ComethWallet({
        authAdapter: walletAdaptor,
				apiKey: import.meta.env.VITE_COMMETH_CHIADO,
        rpcUrl: import.meta.env.VITE_RPC_CHIADO,
			});

			provider = new ComethProvider(walletInstance);
		},

    async connectWallet() {
      localStorageAddress = localStorage.getItem("walletAddress");
  
			if (localStorageAddress) {
				await walletInstance.connect(localStorageAddress);
			} else {
				await walletInstance.connect();
				localStorage.setItem("walletAddress", await walletInstance.getAddress());
			}
			console.log(await walletInstance.getAddress());
    },
    
    async depositSDAI(amount: string) { // Input amount from frontend
      const USER = walletInstance.getAddress();

      const wxDAI = new Contract("0x18c8a7ec7897177E4529065a7E7B0878358B3BfF", ["function approve(address, uint256)"]) // address: wallet/contract you want to approve to use funds, uint256: amount of funds you give approval
      const sDAIapproveTx = await wxDAI.populateTransaction.approve("0x20e5eB701E8d711D419D444814308f8c2243461F", utils.parseUnits(amount, 18)); //encoded functioncall
      
      const sDAI = new Contract("0x20e5eB701E8d711D419D444814308f8c2243461F", ["function deposit(uint256, address)"]) // uint256: deposit assets going in, receiver: USER address 
      const sDAIdepositTx = await sDAI.populateTransaction.deposit(utils.parseUnits(amount, 18), USER); //encoded functioncall

      const txValues = [{
        to: sDAIapproveTx.to!, // approve wxDAI for sDAI
        data: sDAIapproveTx.data!, // Calldata
        value: "0x00"
      }, {
        to: sDAIdepositTx.to!, // deposit wxDAI for sDAI
        data: sDAIdepositTx.data!, // Calldata
        value: "0x00"
      }];

      const tx = await walletInstance.sendBatchTransactions(txValues);
      const txPending = await provider.getTransaction(tx.safeTxHash);
      const receipt = await txPending.wait();
    },

  
    async withdrawSDAI (amount:number) {
      const value = amount;
      const USER = localStorageAddress;
      provider = new ComethProvider(walletInstance);
      
      const encoder = new utils.Interface(sDAIabi) // get contract
      const encodedApprove = encoder.encodeFunctionData('approve', [USER, value]) //encoded functioncall
      const encodedDeposit = encoder.encodeFunctionData('deposit', [USER, value]) //encoded functioncall
      //TODO - Check the values of these tx and format correctly

      const txValues =  [{
        //Approve function call
        to: sDAIMainnetContract, 
        data: encodedApprove, // Calldata
        value: "0x00", //User Input
      },
      { //deposit function call
        to: sDAIMainnetContract, //deposit xDAI for sDAI
        data: encodedDeposit, // Calldata
        value: "0x00", //User Input
      },]
      
      const tx = await walletInstance.sendBatchTransactions(txValues);
      const txPending = await provider.getTransaction(tx.safeTxHash);
      await txPending.wait();
  },
  async stakeUSDC (amount:number) {
    const value = amount;
    const USER = localStorageAddress;
    provider = new ComethProvider(walletInstance);
    
    const encoder = new utils.Interface(sDAIabi) // get contract
    const encodedApprove = encoder.encodeFunctionData('approve', [USER, value]) //encoded functioncall
    const encodedDeposit = encoder.encodeFunctionData('deposit', [USER, value]) //encoded functioncall
    //TODO - Check the values of these tx and format correctly

    const txValues =  [{
      //Approve function call
      to: sDAIMainnetContract, 
      data: encodedApprove, // Calldata
      value: "0x00", //User Input
    },
    { //deposit function call
      to: sDAIMainnetContract, //deposit xDAI for sDAI
      data: encodedDeposit, // Calldata
      value: "0x00", //User Input
    },]
    
    const tx = await walletInstance.sendBatchTransactions(txValues);
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
  
  }
  return ctx
}