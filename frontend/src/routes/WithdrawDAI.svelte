<script lang="ts">
	import BackButtton from "../elements/BackButtton.svelte";

	import info from "../assets/info.png";

	import arrowSwap from "../assets/arrow-swap.png";
	import loading from "../assets/loading.gif";
	import check from "../assets/check.png";
	import Button from "../elements/Button.svelte";
	import RiskNotice from "../elements/RiskNotice.svelte";
	import { getContext } from "svelte";
	import type { createWeb3Ctx } from "../contexts/web3";
	import type { createFauxBackendCtx } from "../contexts/backend";

	function shortNot(v: number) {
		return v.toFixed(2).replace(".", ",");
	}

	const backend =
		getContext<ReturnType<typeof createFauxBackendCtx>>("fauxBackend");

	const web3 = getContext<ReturnType<typeof createWeb3Ctx>>("web3");
	const EURe = web3.balances.EURe;
	const sDAI = web3.balances.sDAI;
	const usdRatio = web3.ratioUsdEur;
	$: eurRatio = 2 - 1 * $usdRatio;

	let input = "0,00";

	$: output = shortNot(Number(input.replace(",", ".")) * $usdRatio);

	let reviewed = false;

	let orderState = 0;
	async function unstake() {
		orderState = 1;

		await backend.unstakeDAI(input.replace(",", "."));

		orderState = 2;
	}
</script>

<div class="grid relative">
	<BackButtton />

	<div class="flex flex-col mt-2">
		<span class="text-3xl/7">Withdraw Savings DAI</span>
	</div>

	<div class="text-mid mt-1.5 flex gap-1">
		<img
			src={info}
			class="grayscale brightness-50"
			style="transform: scale(0.8) translateY(1px);"
			alt="info"
		/>
		<span>{shortNot(eurRatio)} $ of Savings DAI = 1 €</span>
	</div>

	{#if orderState === 0}
		{#if !reviewed}
			<div
				class="bg-neutral-80 rounded-2xl flex px-4 py-3 mt-4 focus-within:bg-gray-200 relative"
			>
				<div class="mr-6">
					<div class="text-xl">DAI</div>
					<div class="text-gray-450 text-xs font-normal">
						Balance: {shortNot($sDAI)} $
					</div>
				</div>

				<input
					class="bg-transparent outline-none text-xl ml-auto h-7 w-36 text-right mt-2"
					bind:value={input}
				/>
				<div class="ml-2 text-xl mt-2">$</div>

				<!-- <div
				class="flex gap-1 text-gray-450 text-xs font-normal absolute right-4 bottom-3"
			>
				<img
					src={info}
					style="transform: scale(0.875) translate(2px, 1px); filter: grayscale();"
					alt="info"
				/>
				<span>after 0,01 € fee</span>
			</div> -->
			</div>

			<div class="h-2 grid">
				<div
					class="bg-white grid rounded-full z-10 mx-auto w-6 h-6"
					style="transform: translate(0, -8px);"
				>
					<img
						style="transform: translate(6.5px, 4px) scale(0.875);"
						src={arrowSwap}
						alt="from euro to sDAI"
					/>
				</div>
			</div>

			<div
				class="bg-neutral-80 rounded-2xl flex px-4 py-3 focus-within:bg-gray-200"
			>
				<div class="mr-6">
					<div class="text-xl">EUR</div>
					<div class="text-gray-450 text-xs font-normal">
						Balance: {shortNot($EURe)} €
					</div>
				</div>

				<input
					class="bg-transparent outline-none text-xl ml-auto h-7 w-36 text-right mt-2"
					bind:value={output}
				/>
				<div class="ml-2 text-xl mt-2">€</div>
			</div>
		{:else}
			<div
				class="bg-white rounded-2xl flex flex-col px-4 py-3 min-w-[19rem] mt-4"
			>
				<div class="m1-0 text-lg font-medium">
					<div class="bg-white rounded w-full max-w-md">
						<div class="flex flex-col gap-4 text-sm">
							<div class="flex justify-between items-center">
								<div class="text-gray-400">Amount</div>
								<div>{input} $</div>
							</div>

							<div class="flex justify-between items-center">
								<div class="text-gray-400">Price</div>
								<div class="text-sky-500">
									<i class="info-icon" />
									{input} $ = {output} €
								</div>
							</div>

							<div class="flex justify-between items-center">
								<div class="text-gray-400">Exchanged</div>
								<div>{output} €</div>
							</div>

							<div class="flex justify-between items-center">
								<div class="text-gray-400">Fees</div>
								<div class="text-sky-500"><i class="info-icon" /> 0,00 €</div>
							</div>

							<div class="flex justify-between items-center">
								<div class="text-gray-400">Estimated total proceeds</div>
								<div>{output} €</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/if}

		<Button
			class="mt-4"
			on:click={reviewed ? unstake : () => (reviewed = true)}
			disabled={Number(input.replace(",", ".")) == 0}
			>{reviewed ? "Withdraw Savings DAI" : "Review order"}</Button
		>
	{:else}
		<div
			class="bg-white rounded-2xl mt-4 p-4 flex gap-4 justify-center items-center"
		>
			{#if orderState === 1}
				<img src={loading} class="w-6 h-6" alt="loading spinner" />
				<div class="text-lg">Withdrawing DAI</div>
			{:else}
				<img src={check} class="w-7 h-7" alt="success check" />
				<div class="text-lg">Success!</div>
			{/if}
		</div>
	{/if}

	<RiskNotice
		key="dai"
		desc="Your Euro is pegged to DAI which is pegged to the US Dollar."
	/>
</div>
