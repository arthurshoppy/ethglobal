<script lang="ts">
	import { getContext } from "svelte";
	import type { createRoutingCtx } from "../contexts/routing";
	import type { createWeb3Ctx } from "../contexts/web3";
	import Button from "../elements/Button.svelte";
	import sdai from "../assets/sdai.png";
	import usdc from "../assets/usdc.png";
	import indicatorUp from "../assets/indicator-up.png";
	import AssetBubble from "../elements/AssetBubble.svelte";

	const routing = getContext<ReturnType<typeof createRoutingCtx>>("routing");

	const web3 = getContext<ReturnType<typeof createWeb3Ctx>>("web3");
	const balance = web3.balances.totalBalance;
	const sDAI = web3.balances.sDAI;
	const cUSDC = web3.balances.cUSDC;
	const apyDAI = web3.apy.dai;
	const apyUSDC = web3.apy.usdc;

	$: accountFunded = $balance > 0;

	$: assets = [
		{
			icon: sdai,
			title: "Savings DAI",
			percentage: $apyDAI.toFixed(2).replace(".", ","),
			balance: $sDAI,
			route: "depositdai",
		},
		{
			icon: usdc,
			title: "USD Coin",
			percentage: $apyUSDC.toFixed(2).replace(".", ","),
			balance: $cUSDC,
			route: "depositusdc",
		},
	].filter((a) => a.balance == 0);
</script>

<div class="grid gap-2">
	{#each assets as asset}
		<div class="relative">
			<AssetBubble icon={asset.icon}>
				<div slot="title">{asset.title}</div>
				<div slot="desc" class="font-normal text-mid text-green-500 flex gap-1">
					<img
						src={indicatorUp}
						alt="indicator up"
						class="h-2 w-2 self-center"
					/>
					{asset.percentage} % per year
				</div>
				<div slot="right" class="ml-auto self-center">
					<Button
						smol={true}
						disabled={!accountFunded}
						on:click={() => routing.goto(asset.route)}>Earn</Button
					>
				</div>
			</AssetBubble>
		</div>
	{/each}
</div>
