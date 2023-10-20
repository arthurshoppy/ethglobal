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

      //APPROVE 
      const wxDAI = new Contract("0x18c8a7ec7897177E4529065a7E7B0878358B3BfF", ["function approve(address, uint256)"]) // address: wallet/contract you want to approve to use funds, uint256: amount of funds you give approval
      const sDAIapproveTx = await wxDAI.populateTransaction.approve("0x20e5eB701E8d711D419D444814308f8c2243461F", utils.parseUnits(amount, 18)); 
      //DEPOSIT
      const sDAI = new Contract("0x20e5eB701E8d711D419D444814308f8c2243461F", ["function deposit(uint256, address)"]) // uint256: deposit assets going in, receiver: USER address 
      const sDAIdepositTx = await sDAI.populateTransaction.deposit(utils.parseUnits(amount, 18), USER); 

      const txValues = [{
        // approve wxDAI for sDAI
        to: sDAIapproveTx.to!, 
        data: sDAIapproveTx.data!, 
        value: "0x00"
      }, {
        // deposit wxDAI for sDAI
        to: sDAIdepositTx.to!, 
        data: sDAIdepositTx.data!,
        value: "0x00"
      }];

      const tx = await walletInstance.sendBatchTransactions(txValues);
      const txPending = await provider.getTransaction(tx.safeTxHash);
      const receipt = await txPending.wait();
      console.log(receipt)
    },

  
    async withdrawSDAI (amount:string) {
      const USER = walletInstance.getAddress();

      const sDAI = new Contract("0x20e5eB701E8d711D419D444814308f8c2243461F", 
      ["function approve(address, uint256) external returns (bool)", //USER or contract, assets, 
      "function withdraw(uint256, address, address)"]) // withdraw: asset, receiver, owner 
      //APPROVE & WITHDRAW 
      const sDAIapproveTx = await sDAI.populateTransaction.approve("0x20e5eB701E8d711D419D444814308f8c2243461F", utils.parseUnits(amount, 18)); 
      const sDAIwithdrawTx = await sDAI.populateTransaction.withdraw(utils.parseUnits(amount, 18), USER, USER); 

      const txValues = [{
        to: sDAIapproveTx.to!, // approve sDAI to the sDAI  Contract
        data: sDAIapproveTx.data!,
        value: "0x00"
      }, {
        to: sDAIwithdrawTx.to!, // withdraw sDAI
        data: sDAIwithdrawTx.data!,
        value: "0x00"
      }];

      const tx = await walletInstance.sendBatchTransactions(txValues);
      const txPending = await provider.getTransaction(tx.safeTxHash);
      const receipt = await txPending.wait();
      console.log(receipt)
    },

    async stakeUSDC (amount:string) {

  // eureusdCurve Router: "0xE3FFF29d4DC930EBb787FeCd49Ee5963DADf60b6", //Gnosis Router? 
	// EURe: "0xcB444e90D8198415266c6a2724b7900fb12FC56E", //Gnosis
  // GnosisUSDC: "0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83"
	// USDC.e:"0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
  // cUSDCv3: "0xF25212E676D1F7F89Cd72fFEe66158f541246445", //Polygon 
	// PolygonUSDC: "" 

      const USER = walletInstance.getAddress();
      /* Flow
      On gnosis chain
      Optional: The one sided flow can be done with contract to contract interactions, encode calldata and add it to the tx ?? 
      EURe --> approve curvEUR/USDC pool at EURe contract & swap it to USDC
      USDC --> approve Connext Contract at USDC contract & bridge transaction 
      Await completion and arrival to 
      Polygon POS
      USDC --> cUSDC --> approve cUSDC at USDC contract & deposit
      */
      const EURe = new Contract("0xcB444e90D8198415266c6a2724b7900fb12FC56E", ["function approve(address, uint256)"]) // address: wallet/contract you want to approve to use funds, uint256: amount of funds you give approval
      const curvePoolApprove = await EURe.populateTransaction.approve("0xE3FFF29d4DC930EBb787FeCd49Ee5963DADf60b6", utils.parseUnits(amount, 18)); 
      
      const curvePoolSwap = new Contract("0xE3FFF29d4DC930EBb787FeCd49Ee5963DADf60b6", ["function exchange_underlying (uin256, uin256, uin256,uin256)"]) // exchange_underlying(i: uint256, j: uint256, _dx: uint256, _min_dy: uint256, _receiver: address = msg.sender) -> uint256
      const EUReSwapTx = await EURe.populateTransaction.exchange_underlying("0x20e5eB701E8d711D419D444814308f8c2243461F", utils.parseUnits(amount, 18)); 
      
      const GnosisUSDC = new Contract("0xcB444e90D8198415266c6a2724b7900fb12FC56E", [""]) 
      const connextBridge = new Contract("", [""]) // address: wallet/contract you want to approve to use funds, uint256: amount of funds you give approval
      const bridgeApproveTx = await EURe.populateTransaction.approve("0x20e5eB701E8d711D419D444814308f8c2243461F", utils.parseUnits(amount, 18)); 
      

      const txValues = [{
        to: curvePoolApprove.to!, // approve wxDAI for sDAI
        data: curvePoolApprove.data!, 
        value: "0x00"
      }, {
        to:curvePoolSwap.to!, // deposit wxDAI for sDAI
        data: curvePoolSwap.data!, 
        value: "0x00"
      }];

      const tx = await walletInstance.sendBatchTransactions(txValues);
      const txPending = await provider.getTransaction(tx.safeTxHash);
      const receipt = await txPending.wait();
      console.log(receipt)
    },


  }
  return ctx
}