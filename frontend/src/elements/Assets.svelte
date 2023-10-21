<script lang="ts">
	import { getContext } from "svelte";
	import AssetBubble from "./AssetBubble.svelte";
	import type { createWeb3Ctx } from "../contexts/web3";

	import eure from "../assets/eure.png";
	import sdai from "../assets/sdai.png";
	import usdc from "../assets/usdc.png";
	import indicatorUp from "../assets/indicator-up.png";

	const web3 = getContext<ReturnType<typeof createWeb3Ctx>>("web3");
	const EURe = web3.balances.EURe;
	const sDAI = web3.balances.sDAI;
	const cUSDC = web3.balances.cUSDC;
	const apyDAI = web3.apy.dai;
	const apyUSDC = web3.apy.usdc;

	$: assets = [
		{
			icon: eure,
			title: "EURe",
			name: "EURe",
			symbol: "€",
			percentage: "0,00",
			balance: $EURe,
		},
		{
			icon: sdai,
			title: "Savings DAI",
			name: "DAI",
			symbol: "$",
			percentage: $apyDAI.toFixed(2).replace(".", ","),
			balance: $sDAI,
		},
		{
			icon: usdc,
			title: "USD Coin",
			name: "USDC",
			symbol: "$",
			percentage: $apyUSDC.toFixed(2).replace(".", ","),
			balance: $cUSDC,
		},
	]
		.filter((a) => a.balance > 0)
		.map((a) => ({ ...a, balance: a.balance.toFixed(2).replace(".", ",") }));
</script>

<div class="grid gap-2">
	{#each assets as asset}
		<AssetBubble icon={asset.icon}>
			<div slot="title">{asset.title}</div>
			<div slot="desc" class="font-normal text-mid text-neutral-380 flex gap-1">
				{asset.balance}
				{asset.name}
			</div>
			<div slot="right" class="ml-auto self-center flex flex-col items-end">
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
			</div>
		</AssetBubble>
	{/each}
</div>
