<script lang="ts">
	import { getContext } from "svelte";
	import AssetBubble from "./AssetBubble.svelte";
	import type { createWeb3Ctx } from "../contexts/web3";
	import type { createRoutingCtx } from "../contexts/routing";

	import eure from "../assets/eure.png";
	import sdai from "../assets/sdai.png";
	import usdc from "../assets/usdc.png";
	import indicatorUp from "../assets/indicator-up.png";
	import arrowUp from "../assets/arrow-up.png";
	import arrowDown from "../assets/arrow-down.png";

	const routing = getContext<ReturnType<typeof createRoutingCtx>>("routing");

	const web3 = getContext<ReturnType<typeof createWeb3Ctx>>("web3");
	const EURe = web3.balances.EURe;
	const sDAI = web3.balances.sDAI;
	const cUSDC = web3.balances.cUSDC;
	const apyDAI = web3.apy.dai;
	const apyUSDC = web3.apy.usdc;

	let extended = "";

	$: assets = [
		{
			icon: eure,
			title: "EURe",
			name: "EURe",
			symbol: "€",
			percentage: "0,00",
			balance: $EURe,
			isStrategy: false,
		},
		{
			icon: sdai,
			title: "Savings DAI",
			name: "DAI",
			symbol: "$",
			percentage: $apyDAI.toFixed(2).replace(".", ","),
			balance: $sDAI,
			isStrategy: true,
		},
		{
			icon: usdc,
			title: "USD Coin",
			name: "USDC",
			symbol: "$",
			percentage: $apyUSDC.toFixed(2).replace(".", ","),
			balance: $cUSDC,
			isStrategy: true,
		},
	]
		.filter((a) => a.balance > 0)
		.map((a) => ({ ...a, balance: a.balance.toFixed(2).replace(".", ",") }));
</script>

<div class="grid gap-2">
	{#each assets as asset}
		<AssetBubble
			icon={asset.icon}
			class="{asset.isStrategy && 'hover:bg-gray-50 cursor-pointer'} none"
			on:click={() =>
				(extended =
					extended !== asset.name && asset.isStrategy ? asset.name : "")}
		>
			<div slot="title">{asset.title}</div>
			<div slot="desc" class="font-normal text-mid text-neutral-380 flex gap-1">
				{asset.balance}
				{asset.name}
			</div>
			<div slot="right" class="ml-auto self-center flex flex-col items-end">
				{#if extended === asset.name}
					<div class="flex gap-[1.45rem] mr-3">
						<button
							class="rounded-full transition-colors text-white font-normal bg-sky-500 hover:bg-sky-600 active:bg-sky-700 select-none w-10 h-10 flex"
							on:click={() =>
								routing.goto("deposit" + asset.name.toLowerCase())}
						>
							<img
								src={arrowDown}
								alt="arrow down deposit"
								class="m-auto h-4 w-2.5"
							/>
						</button>

						<button
							class="rounded-full transition-colors text-white font-normal bg-sky-500 hover:bg-sky-600 active:bg-sky-700 select-none w-10 h-10 flex"
							on:click={() =>
								routing.goto("withdraw" + asset.name.toLowerCase())}
						>
							<img
								src={arrowUp}
								alt="arrow down deposit"
								class="m-auto h-4 w-2.5"
							/>
						</button>
					</div>
				{:else}
					<div class="text-right">{asset.balance} {asset.symbol}</div>
					<div
						class="font-normal text-mid flex gap-1 {asset.percentage[0] == '0'
							? 'text-gray-300'
							: 'text-green-500'}"
					>
						{#if asset.percentage[0] != "0"}
							<img
								src={indicatorUp}
								alt="indicator up"
								class="h-2 w-2 self-center"
							/>
						{/if}
						{asset.percentage} %
					</div>
				{/if}
			</div>
		</AssetBubble>
	{/each}
</div>
