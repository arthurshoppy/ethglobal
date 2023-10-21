<script lang="ts">
	import { getContext } from "svelte";
	import EarningStrategies from "../elements/EarningStrategies.svelte";
	import type { createRoutingCtx } from "../contexts/routing";
	import type { createWeb3Ctx } from "../contexts/web3";
	import arrowUp from "../assets/arrow-up.png";
	import arrowDown from "../assets/arrow-down.png";
	import indicatorUp from "../assets/indicator-up.png";
	import Assets from "../elements/Assets.svelte";

	const routing = getContext<ReturnType<typeof createRoutingCtx>>("routing");

	const web3 = getContext<ReturnType<typeof createWeb3Ctx>>("web3");
	const balance = web3.balances.totalBalance;
	const sDAI = web3.balances.sDAI;
	const cUSDC = web3.balances.cUSDC;
	const apyDAI = web3.apy.dai;
	const apyUSDC = web3.apy.usdc;
</script>

<div class="grid">
	<div class="bg-white rounded-2xl flex px-6 py-5 mb-2">
		<div class="mr-12">
			<div class="flex items-end mt-1 w-40">
				<div class="text-4xl font-bold">{$balance.toFixed(0)}</div>
				<span class="text-xl mb-0.5 -ml-0.5">,</span>
				<div class="text-lg font-bold -mb-px">
					{($balance % 1).toFixed(2).split(".")[1]} €
				</div>
			</div>
			{#if $sDAI > 0 || $cUSDC > 0}
				<div class="mt-px -mb-2 flex gap-2">
					<div class="font-normal text-mid flex gap-1 text-green-500">
						<img
							src={indicatorUp}
							alt="indicator up"
							class="h-2 w-2 self-center"
						/>
						{Math.max($apyDAI, $apyUSDC).toFixed(2).replace(".", ",")} %
					</div>
				</div>
			{:else}
				<div class="text-neutral-380 text-xs font-normal">Total balance</div>
			{/if}
		</div>

		<div class="flex flex-col gap-1 items-center ml-auto mr-4">
			<button
				class="rounded-full transition-colors text-white font-normal bg-sky-500 hover:bg-sky-600 active:bg-sky-700 select-none w-10 h-10 flex"
				on:click={() => routing.goto("deposit")}
			>
				<img
					src={arrowDown}
					alt="arrow down deposit"
					class="m-auto h-4 w-2.5"
				/>
			</button>
			<div class="text-neutral-380 text-xs font-normal select-none">
				Deposit
			</div>
		</div>

		<div class="flex flex-col gap-1 items-center">
			<button
				class="rounded-full transition-colors text-white font-normal {$balance <=
				0
					? 'bg-neutral-300 pointer-events-none'
					: 'bg-sky-500 hover:bg-sky-600 active:bg-sky-700'} select-none w-10 h-10 flex"
				on:click={() => routing.goto("withdraw")}
			>
				<img src={arrowUp} alt="arrow down deposit" class="m-auto h-4 w-2.5" />
			</button>
			<div class="text-neutral-380 text-xs font-normal select-none">
				Withdraw
			</div>
		</div>
	</div>

	<Assets />

	<!-- <div class="bg-white rounded-2xl flex flex-col px-6 py-5">
		<div class="mx-auto font-semibold">Earn 5,00% interest</div>
		<div class="text-neutral-380 text-mid font-normal text-center">
			Start by adding money to your account.
		</div>

		<Button class="mt-2" disabled={false} on:click={() => routing.goto("earn")}
			>Add money</Button
		>
	</div> -->

	{#if $sDAI == 0 || $cUSDC == 0}
		<div
			class="text-neutral-380 bg-white rounded-2xl py-1 text-center font-normal text-sm mt-10 mb-2"
		>
			{$balance > 0
				? "Earn up to 5,00 % interest"
				: "Start by funding your account"}
		</div>
	{/if}

	<EarningStrategies />
</div>
