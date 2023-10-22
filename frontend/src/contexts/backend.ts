import { writable } from 'svelte/store'
import {
  ComethProvider,
  ComethWallet,
  ConnectAdaptor,
  SupportedNetworks,
	type WalletConfig
} from '@cometh/connect-sdk';
import { create } from "@connext/sdk";
import { cachedStore } from '../helpers/reactivity-helpers';
import { type BigNumberish, Contract, utils, BigNumber, type Wallet } from "ethers"
import {Mainnet} from '../shared/addresses'
import { API } from '@cometh/connect-sdk/dist/services/API';

type BasePopuplatedTx = { to?: string, data?: string, value?: BigNumberish }

function asMetaTx<T extends BasePopuplatedTx>(tx: T) {
	return {
		to: tx.to!,
		data: tx.data!,
		value: tx.value === undefined ? "0x0" : tx.value.toString()
	}
}

enum PoolToken {
  EURe,
  wxDAI,
  USDC
}

enum Chain {
	Gnosis = "6778479",
	Polygon = "1886350457"
}

export function createFauxBackendCtx() {

  let walletGnosis: ComethWallet;
  let providerGnosis: ComethProvider;
	let walletPolygon: ComethWallet;
  let providerPolygon: ComethProvider;

	const byChain = (chain: Chain) => {
		const provider = chain === Chain.Gnosis ? providerGnosis : providerPolygon
		const wallet = chain === Chain.Gnosis ? walletGnosis : walletPolygon
		return [wallet, provider] as const;
	}

  const ctx = {
		onBalanceChanged: () => undefined,

    address: cachedStore(writable<string | null>(null)),

		async initializeWallet() {
			// Gnosis
      const walletAdaptorG = new ConnectAdaptor({
        chainId: SupportedNetworks.GNOSIS,
				apiKey: import.meta.env.VITE_COMMETH_GNOSIS,
			});
			
			walletGnosis = await new ComethWallet({
        authAdapter: walletAdaptorG,
				apiKey: import.meta.env.VITE_COMMETH_GNOSIS,
        rpcUrl: import.meta.env.VITE_RPC_GNOSIS
			});
			(walletGnosis! as unknown as WalletConfig).uiConfig!.displayValidationModal = false
			
			providerGnosis = new ComethProvider(walletGnosis);

			// Polygon
			const walletAdaptorP = new ConnectAdaptor({
        chainId: SupportedNetworks.POLYGON,
				apiKey: import.meta.env.VITE_COMMETH_POLYGON
			});
			
			walletPolygon = await new ComethWallet({
        authAdapter: walletAdaptorP,
				apiKey: import.meta.env.VITE_COMMETH_POLYGON,
        rpcUrl: import.meta.env.VITE_RPC_POLYGON,
				uiConfig: { displayValidationModal: false }
			});
			(walletPolygon! as unknown as WalletConfig).uiConfig!.displayValidationModal = false

			providerPolygon = new ComethProvider(walletPolygon);
		},

    async connectWallet() {
      const addressGnosis = localStorage.getItem("walletAddress");
			if (addressGnosis) {
				await walletGnosis.connect(addressGnosis);
			} else {
				await walletGnosis.connect();
				localStorage.setItem("walletAddress", walletGnosis.getAddress());
			}
			await walletPolygon.connect(walletGnosis.getAddress());

			const api = new API(import.meta.env.VITE_COMMETH_POLYGON, +SupportedNetworks.POLYGON)
			await api.initWallet({
				ownerAddress: this.getEOA().address
			})

			ctx.address.set(walletGnosis.getAddress())

			console.log("Address: " + walletPolygon.getAddress());
			console.log("xDAI: " + utils.formatEther(await providerGnosis.getBalance(walletGnosis.getAddress())).toString())
    },

		getEOA() {
			return walletGnosis.authAdapter.getSigner() as Wallet
		},

		async sendBatch(chain: Chain, txs: BasePopuplatedTx[]) {
			const [wallet, provider] = byChain(chain)
			const txHashes: string[] = []
			// TODO: use sendBatchTransactions here if gas estimation works on commeth's side
			for (const rawTx of txs) {
				console.log(asMetaTx(rawTx))
				const tx = await wallet.sendTransaction(asMetaTx(rawTx))
				const txPending = await provider.getTransaction(tx.safeTxHash);
      	const txReceipt = await txPending.wait();
				console.log(txReceipt)
				await (new Promise(r => setTimeout(r, 10000))) // don't spam the rpc...
				txHashes.push(txReceipt.transactionHash)
			}
			return txHashes;
		},

		async test() {
			// const USDC = new Contract(Mainnet.gnosis.USDC, ["function approve(address, uint256)"])
			// const approveCurve = await USDC.populateTransaction.approve(Mainnet.gnosis.eureusdCurve, utils.parseUnits("2.1", 6))

			// const [swap, dy] = await ctx.swapTx(PoolToken.USDC, PoolToken.EURe, utils.parseUnits("2.1", 6))

			// await ctx.sendBatch(Chain.Gnosis, [
			// 	approveCurve,
			// 	swap
			// ])

			
		},

		async swapTx(tokenIn: PoolToken, tokenOut: PoolToken, amountIn: BigNumberish) {
			const eureusdPool = new Contract(Mainnet.gnosis.eureusdCurve, [
				"function get_dy_underlying(uint256, uint256, uint256) returns(uint256)",
				"function exchange_underlying(uint256, uint256, uint256, uint256)"
			], providerGnosis);

			const dy = await eureusdPool.callStatic.get_dy_underlying(tokenIn, tokenOut, amountIn)
			const slippage = 1000 // 0.1%
			const dyAfterSlippage = dy.sub(dy.div(slippage))
			const tx = await eureusdPool.populateTransaction.exchange_underlying(tokenIn, tokenOut, amountIn, dyAfterSlippage)
			return [tx, dyAfterSlippage] as const
		},

		async bridgeTxs(from: Chain, to: Chain, token: string, amount: BigNumberish) {
			const txs: BasePopuplatedTx[] = []

			const { sdkBase } = await create({
				signerAddress: walletGnosis.getAddress(), // TODO: this might be the safe or gas-payer address???
				network: "mainnet",
				chains: {
					6778479: { providers: ["https://rpc.gnosis.gateway.fm"] },
					1886350457: { providers: ["https://polygon.llamarpc.com"] }
				}
			});

			const relayerFeeBn = await sdkBase.estimateRelayerFee({
				originDomain: from,
				destinationDomain: to
			})
			const relayerFee = relayerFeeBn.add(relayerFeeBn.div(2)).toString() // increase relayer fee

			const xcallParams = {
				origin: from,           								// send from Gnosis
				destination: to, 												// to Polygon
				to: walletGnosis.getAddress(),					// the address that should receive the funds on destination
				asset: token,            								// address of the token contract
				delegate: walletGnosis.getAddress(),  	// address allowed to execute transaction on destination side in addition to relayers
				amount: amount.toString(),          		// amount of tokens to transfer
				slippage: "400",             						// the maximum amount of slippage the user will accept in BPS (e.g. 30 = 0.3%)
				callData: "0x",                 				// empty calldata for a simple transfer (byte-encoded)
				relayerFee: relayerFee         					// fee paid to relayers
			};

			const approveTxReq = await sdkBase.approveIfNeeded(
				from,
				token,
				amount.toString()
			)

			if (approveTxReq) {
				txs.push({ to: approveTxReq.to, data: approveTxReq.data?.toString() })
			}

			const xcallTxReq = await sdkBase.xcall(xcallParams);
			xcallTxReq.gasLimit = BigNumber.from("10000000"); 
			const gasFee = await providerGnosis.getGasPrice()
			xcallTxReq.maxFeePerGas = gasFee.mul(2)
			xcallTxReq.maxPriorityFeePerGas = gasFee.mul(2)

			txs.push({ to: xcallTxReq.to, data: xcallTxReq.data?.toString(), value: (xcallTxReq.value as unknown as { hex: string }).hex })

			return txs
		},

		ensureTokenBalance(destinationChain: Chain, token: string, decimals = 18) {
			// TODO: dirty, but for the prototype the best solution
			// TODO: best solution is to use connext subgraph...
			return new Promise<BigNumber>(r => {
				const [wallet, provider] = byChain(destinationChain)
				const id = setInterval(async () => {
					const contract = new Contract(token, ["function balanceOf(address) returns(uint256)"], provider)
					const balance: BigNumber = await contract.callStatic.balanceOf(wallet.getAddress())
					if (balance.gte(utils.parseUnits("0.1", decimals))) { // TODO: this can probably be true in some edgecases...
						clearInterval(id)
						r(balance)
					}
				}, 10_000)
			})
		},

    async stakeDAI(amountInEUR: string) {
			const amountEUR = utils.parseUnits(amountInEUR, 18)

			const EURe = new Contract(Mainnet.gnosis.EURe, ["function approve(address, uint256)"])
			const approveCurve = await EURe.populateTransaction.approve(Mainnet.gnosis.eureusdCurve, amountEUR)

			const [swap, amountDAI] = await ctx.swapTx(PoolToken.EURe, PoolToken.wxDAI, amountEUR)

      const wxDAI = new Contract(Mainnet.gnosis.wxDAI, ["function approve(address, uint256)"])
      const approveDAI = await wxDAI.populateTransaction.approve(Mainnet.gnosis.sDAI, amountDAI);

      const sDAI = new Contract(Mainnet.gnosis.sDAI, ["function deposit(uint256, address)"])
      const depositDAI = await sDAI.populateTransaction.deposit(amountDAI, walletGnosis.getAddress());

			await ctx.sendBatch(Chain.Gnosis, [
				approveCurve,
				swap,
				approveDAI,
				depositDAI
			])

			ctx.onBalanceChanged()
    },

		async unstakeDAI(amountInDAI: string) {
			const amountDAI = utils.parseUnits(amountInDAI, 18)

      const sDAI = new Contract(Mainnet.gnosis.sDAI, ["function redeem(uint256, address, address)"])
      const redeemDAI = await sDAI.populateTransaction.redeem(amountDAI, walletGnosis.getAddress(), walletGnosis.getAddress());

			const wxDAI = new Contract(Mainnet.gnosis.wxDAI, ["function approve(address, uint256)"])
      const approveCurve = await wxDAI.populateTransaction.approve(Mainnet.gnosis.eureusdCurve, amountDAI);

			const [swap] = await ctx.swapTx(PoolToken.wxDAI, PoolToken.EURe, amountDAI)

			await ctx.sendBatch(Chain.Gnosis, [
				redeemDAI,
				approveCurve,
				swap
			])

			ctx.onBalanceChanged()
    },

		async stakeUSDC(amountInEUR: string) {
			const amountEUR = utils.parseUnits(amountInEUR, 18)

			const EURe = new Contract(Mainnet.gnosis.EURe, ["function approve(address, uint256)"])
			const approveCurve = await EURe.populateTransaction.approve(Mainnet.gnosis.eureusdCurve, amountEUR)

			const [swap, amountUSDC] = await ctx.swapTx(PoolToken.EURe, PoolToken.USDC, amountEUR)

			const bridgeTxs = await ctx.bridgeTxs(Chain.Gnosis, Chain.Polygon, Mainnet.gnosis.USDC, amountUSDC)
			
			// await ctx.sendBatch(Chain.Gnosis, [
			// 	approveCurve,
			// 	swap,
			// 	...bridgeTxs
			// ])

			const amountUSDCBridged = await ctx.ensureTokenBalance(Chain.Polygon, Mainnet.polygon.USDC, 6)

			const USDC = new Contract(Mainnet.polygon.USDC, ["function approve(address, uint256)"])
			const approveComet = await USDC.populateTransaction.approve(Mainnet.polygon.cUSDC, amountUSDCBridged)

			const Comet = new Contract(Mainnet.polygon.cUSDC, ["function supply(address, uint256)"]);
			const supply = await Comet.populateTransaction.supply(Mainnet.polygon.USDC, amountUSDCBridged)

			await ctx.sendBatch(Chain.Polygon, [
				approveComet,
				supply
			])

			ctx.onBalanceChanged()
		},

		async unstakeUSDC(amountInUSD: string) {
			const amountUSD = utils.parseUnits(amountInUSD, 6)

			const Comet = new Contract(Mainnet.polygon.cUSDC, ["function withdraw(address, uint256)"]);
			const withdraw = await Comet.populateTransaction.withdraw(Mainnet.polygon.USDC, amountUSD)
			
			const bridgeTxs = await ctx.bridgeTxs(Chain.Polygon, Chain.Gnosis, Mainnet.polygon.USDC, amountUSD)

      await ctx.sendBatch(Chain.Polygon, [
				withdraw,
				...bridgeTxs
			])

			const amountUSDCBridged = await ctx.ensureTokenBalance(Chain.Gnosis, Mainnet.gnosis.USDC, 6)

			const USDC = new Contract(Mainnet.gnosis.USDC, ["function approve(address, uint256)"])
			const approveCurve = await USDC.populateTransaction.approve(Mainnet.gnosis.eureusdCurve, amountUSDCBridged)
		
			const [swap] = await ctx.swapTx(PoolToken.USDC, PoolToken.EURe, amountUSDCBridged)

			await ctx.sendBatch(Chain.Gnosis, [
				approveCurve,
				swap
			])

			ctx.onBalanceChanged()
		}
  }

  return ctx
}