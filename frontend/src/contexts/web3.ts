import { readable, writable } from 'svelte/store';
import { cachedStore, consistentStore, refreshableStore } from '../helpers/reactivity-helpers';
import { ethers, providers, Contract, BigNumber, utils } from "ethers"
import { getContext } from 'svelte';
import type { createFauxBackendCtx } from './backend';

export function createWeb3Ctx() {

  const backend =
		getContext<ReturnType<typeof createFauxBackendCtx>>("fauxBackend");

	let providerGnosis: ethers.providers.JsonRpcProvider
	let providerPolygon: ethers.providers.JsonRpcProvider

  const ctx = {

		ratioUsdEur: cachedStore(writable<number>(0.95)),

		async updateBalances() {
			// 0x614bbb4705D1016E6D218322106C9760E920B476 eure/usdc uni
			// 0x7F62D301b80ea7c09665d104B86C0cf140634801 eure/dai uni

			const euroCurve = new Contract("0x056c6c5e684cec248635ed86033378cc444459b0", ["function last_prices() view returns (uint256)"], providerGnosis)
			const price: BigNumber = await euroCurve.last_prices()
			ctx.ratioUsdEur.set(Number(utils.formatUnits(price, 18)))

			ctx.balances.EURe.refresh()
			ctx.balances.sDAI.refresh()
			ctx.balances.cUSDC.refresh()
		},

		balances: {
			totalBalance: consistentStore(readable<number>(0, set => {
				const sumBalance = () => {
					set((ctx.balances.EURe.current || 0) + ((ctx.balances.sDAI.current || 0) * ctx.ratioUsdEur.current) + ((ctx.balances.cUSDC.current || 0) * ctx.ratioUsdEur.current))
				}
				ctx.balances.EURe.subscribe(sumBalance)
				ctx.balances.sDAI.subscribe(sumBalance)
				ctx.balances.cUSDC.subscribe(sumBalance)
				ctx.ratioUsdEur.subscribe(sumBalance)
			})),
	
			EURe: cachedStore(refreshableStore(writable<number>(0), async () => {
				const eure = new Contract("0xcB444e90D8198415266c6a2724b7900fb12FC56E", ["function balanceOf(address) view returns (uint256)"], providerGnosis)
				const balance: BigNumber = await eure.balanceOf(backend.address.current)
				return Number(utils.formatUnits(balance, 18))
			})),
	
			sDAI: cachedStore(refreshableStore(writable<number>(0), async () => {
				const sdai = new Contract("0xaf204776c7245bF4147c2612BF6e5972Ee483701", ["function maxRedeem(address) view returns (uint256)"], providerGnosis)
				const balance: BigNumber = await sdai.maxRedeem(backend.address.current)
				return Number(utils.formatUnits(balance, 18))
			})),
	
			cUSDC: cachedStore(refreshableStore(writable<number>(0), async () => {
				const cusdc = new Contract("0xF25212E676D1F7F89Cd72fFEe66158f541246445", ["function balanceOf(address) view returns (uint256)"], providerPolygon)
				const balance: BigNumber = await cusdc.balanceOf(backend.address.current)
				return Number(utils.formatUnits(balance, 8))
			}))
		}

	}

	backend.address.subscribe(addr => {
		if (!addr) return
		
		if (!providerGnosis) {
			providerGnosis = new providers.JsonRpcProvider(import.meta.env.VITE_RPC_GNOSIS)
			providerPolygon = new providers.JsonRpcProvider(import.meta.env.VITE_RPC_POLYGON)
		}

		ctx.updateBalances()
	})

  return ctx
}
