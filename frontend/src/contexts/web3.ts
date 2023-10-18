import { readable, writable } from 'svelte/store';
import { cachedStore, consistentStore, refreshableStore } from '../helpers/reactivity-helpers';
import { providers, Contract, BigNumber, utils } from "ethers"
import { getContext } from 'svelte';
import type { createFauxBackendCtx } from './backend';
import { Mainnet } from '../shared/addresses';

export function createWeb3Ctx() {

	const providerGnosis = new providers.JsonRpcProvider(import.meta.env.VITE_RPC_GNOSIS)
	const providerPolygon = new providers.JsonRpcProvider(import.meta.env.VITE_RPC_POLYGON)

	const backend =
		getContext<ReturnType<typeof createFauxBackendCtx>>("fauxBackend");

  const ctx = {

		ratioUsdEur: cachedStore(writable<number>(0.95)),

		async updateBalances() {
			const euroCurve = new Contract(Mainnet.eureusdCurve, ["function price_scale() returns (uint256)"], providerGnosis)
			const price: BigNumber = await euroCurve.callStatic.price_scale()
			ctx.ratioUsdEur.set(2 - Number(utils.formatUnits(price, 18)))

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
				const eure = new Contract(Mainnet.EURe, ["function balanceOf(address) returns (uint256)"], providerGnosis)
				const balance: BigNumber = await eure.callStatic.balanceOf(backend.address.current)
				return Number(utils.formatUnits(balance, 18))
			})),
	
			sDAI: cachedStore(refreshableStore(writable<number>(0), async () => {
				const sdai = new Contract(Mainnet.sDAI, ["function maxRedeem(address) returns (uint256)"], providerGnosis)
				const balance: BigNumber = await sdai.callStatic.maxRedeem(backend.address.current)
				return Number(utils.formatUnits(balance, 18))
			})),
	
			cUSDC: cachedStore(refreshableStore(writable<number>(0), async () => {
				const cusdc = new Contract(Mainnet.cUSDC, ["function balanceOf(address) returns (uint256)"], providerPolygon)
				const balance: BigNumber = await cusdc.callStatic.balanceOf(backend.address.current)
				return Number(utils.formatUnits(balance, 6))
			}))
		}

	}

	backend.address.subscribe(addr => {
		if (!addr) return
		ctx.updateBalances()
	})

  return ctx
}
