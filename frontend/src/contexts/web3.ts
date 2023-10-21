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
			const euroCurve = new Contract(Mainnet.gnosis.eureusdCurve, ["function price_scale() returns (uint256)"], providerGnosis)
			const price: BigNumber = await euroCurve.callStatic.price_scale()
			ctx.ratioUsdEur.set(2 - Number(utils.formatUnits(price, 18)))

			ctx.balances.EURe.refresh()
			ctx.balances.sDAI.refresh()
			ctx.balances.cUSDC.refresh()
			ctx.apy.dai.refresh()
			ctx.apy.usdc.refresh()
			ctx.interest.dai.refresh()
			ctx.interest.usdc.refresh()
		},

		balances: {
			totalBalance: consistentStore(readable<number>(0, set => {
				const sumBalance = () => {
					const balances = ctx.balances;
					const ratioUsdEur = ctx.ratioUsdEur.current;
					set((balances.EURe.current || 0) + ((balances.sDAI.current || 0) * ratioUsdEur) + ((balances.cUSDC.current || 0) * ratioUsdEur))
				}
				ctx.balances.EURe.subscribe(sumBalance)
				ctx.balances.sDAI.subscribe(sumBalance)
				ctx.balances.cUSDC.subscribe(sumBalance)
				ctx.ratioUsdEur.subscribe(sumBalance)
			})),
	
			EURe: cachedStore(refreshableStore(writable<number>(0), async () => {
				const eure = new Contract(Mainnet.gnosis.EURe, ["function balanceOf(address) returns (uint256)"], providerGnosis)
				const balance: BigNumber = await eure.callStatic.balanceOf(backend.address.current)
				return Number(utils.formatUnits(balance, 18))
			})),
	
			sDAI: cachedStore(refreshableStore(writable<number>(0), async () => {
				const sdai = new Contract(Mainnet.gnosis.sDAI, ["function maxRedeem(address) returns (uint256)"], providerGnosis)
				const balance: BigNumber = await sdai.callStatic.maxRedeem(backend.address.current)
				return Number(utils.formatUnits(balance, 18))
			})),
	
			cUSDC: cachedStore(refreshableStore(writable<number>(0), async () => {
				const cusdc = new Contract(Mainnet.polygon.cUSDC, ["function balanceOf(address) returns (uint256)"], providerPolygon)
				const balance: BigNumber = await cusdc.callStatic.balanceOf(backend.address.current)
				return Number(utils.formatUnits(balance, 6))
			}))
		},

		apy: {
			dai: cachedStore(refreshableStore(writable<number>(5.00), async () => {
				// TODO: maybe this can be fetched from chain
				return Number(5.00)
			})),

			usdc: cachedStore(refreshableStore(writable<number>(5.20), async () => {
				const cusdc = new Contract(Mainnet.polygon.cUSDC, [
					"function getSupplyRate(uint256) returns(uint64)", 
					"function getUtilization() returns(uint256)",
					"function baseIndexScale() external pure returns (uint64)",
					"function baseTrackingSupplySpeed() external view returns (uint)",
					"function totalSupply() external view returns (uint256)",
					"function getPrice(address) public view returns (uint128)"
				], providerPolygon)

				const supplyRate: BigNumber = await cusdc.callStatic.getSupplyRate(await cusdc.callStatic.getUtilization());
				const secondsPerYear = 31536000;  // Number of seconds in a non-leap year
				const supplyApr = +(supplyRate).toString() / 1e18 * (31536000) * 100;
				const aprDecimal = supplyApr / 100;  // Convert APR percentage to a decimal
				const usdcApy = (Math.pow(1 + aprDecimal / secondsPerYear, secondsPerYear) - 1) * 100;

				const priceFeedMantissa = 1e8;
				const usdcMantissa = 1e6;
				const secondsPerDay = 60 * 60 * 24;
				const daysInYear = 365;
				const baseIndexScale = +(await cusdc.callStatic.baseIndexScale());
				const totalSupply = await cusdc.callStatic.totalSupply();

				const compPriceFeedAddress = "0x2A8758b7257102461BC958279054e372C2b1bDE6"
				const baseTokenPriceFeed = "0xfE4A8cc5b5B2366C1B58Bea3858e81843581b2F7"
				const compPriceInUsd = +(await cusdc.callStatic.getPrice(compPriceFeedAddress)).toString() / priceFeedMantissa;
				const usdcPriceInUsd = +(await cusdc.callStatic.getPrice(baseTokenPriceFeed)).toString() / priceFeedMantissa;

				const usdcTotalSupply = +totalSupply.toString() / usdcMantissa;
				const baseTrackingSupplySpeed = +(await cusdc.callStatic.baseTrackingSupplySpeed()).toString();

				const compToSuppliersPerDay = baseTrackingSupplySpeed / baseIndexScale * secondsPerDay;
				const supplyCompApy = (Math.pow((1 + (compPriceInUsd * compToSuppliersPerDay / (usdcTotalSupply * usdcPriceInUsd))), daysInYear) - 1) * 100;

				return usdcApy + supplyCompApy
			})),
		},

		interest: {
			dai: cachedStore(refreshableStore(writable<number>(0), async () => {
				// const sDAI = new Contract(Mainnet.gnosis.sDAI, [
				// 	"event Deposit(address indexed sender, address indexed owner, uint256 assets, uint256 shares)",
				// 	"event Withdraw(address indexed sender, address indexed receiver, address indexed owner, uint256 assets, uint256 shares)",
				// 	"function balanceOf(address) returns (uint256)"
				// ], providerPolygon);

				// const balance = await sDAI.callStatic.balanceOf(backend.address.current);

				// // TODO: query filter fromBlock needs to be tackled different here to ensure all events are catched even after 1000 blocks

				// const eventFilterDeposit = sDAI.filters.Supply(backend.address.current);
				// const eventsDeposit = await sDAI.queryFilter(eventFilterDeposit, -1000);

				// const eventFilterWithdraw = sDAI.filters.Withdraw(backend.address.current);
				// const eventsWithdraw = await sDAI.queryFilter(eventFilterWithdraw, -1000);

				// let principal = 0;
				// eventsDeposit.forEach((event) => {
				// 	principal += event.args!.assets.toNumber();
				// });
				// eventsWithdraw.forEach((event) => {
				// 	principal -= event.args!.amount.toNumber();
				// });

				// const interest = (balance.toNumber() - principal) / Math.pow(10, 6);
				// const ratioUsdEur: number = ctx.ratioUsdEur.current;
				// return interest * ratioUsdEur;
				// const ratioUsdEur: number = ctx.ratioUsdEur.current;
				// return Number(0.00) * ratioUsdEur;
				return 0
			})),

			usdc: cachedStore(refreshableStore(writable<number>(0), async () => {
				// const comet = new Contract(Mainnet.polygon.cUSDC, [
				// 	"event Supply(address indexed from, address indexed dst, uint256 amount)",
				// 	"event Withdraw(address indexed src, address indexed to, uint256 amount)",
				// 	"function balanceOf(address) returns (uint256)"
				// ], providerPolygon);

				// const balance = await comet.callStatic.balanceOf(backend.address.current);

				// // TODO: query filter fromBlock needs to be tackled different here to ensure all events are catched even after 1000 blocks

				// const eventFilterSupply = comet.filters.Supply(backend.address.current);
				// const eventsSupply = await comet.queryFilter(eventFilterSupply, -1000);

				// const eventFilterWithdraw = comet.filters.Withdraw(backend.address.current);
				// const eventsWithdraw = await comet.queryFilter(eventFilterWithdraw, -1000);

				// let principal = 0;
				// eventsSupply.forEach((event) => {
				// 	principal += event.args!.amount.toNumber();
				// });
				// eventsWithdraw.forEach((event) => {
				// 	principal -= event.args!.amount.toNumber();
				// });

				// const interest = (balance.toNumber() - principal) / Math.pow(10, 6);
				// const ratioUsdEur: number = ctx.ratioUsdEur.current;
				// return interest * ratioUsdEur;
				return 0
			})),
		}

	}

	backend.address.subscribe(addr => {
		if (!addr) return
		ctx.updateBalances()
	})

	backend.onBalanceChanged = () => {
		ctx.updateBalances()
	}

  return ctx
}
