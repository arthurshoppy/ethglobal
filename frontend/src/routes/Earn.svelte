<script lang="ts">
	import BackButtton from "../elements/BackButtton.svelte";

	import { getContext } from "svelte";
	import type { createRoutingCtx } from "../contexts/routing";

	const routing = getContext<ReturnType<typeof createRoutingCtx>>("routing");

	import info from "../assets/info.png";
	import attention from "../assets/attention.png";
	import arrowSwap from "../assets/arrow-swap.png";
	import Button from "../elements/Button.svelte";

	let riskNoticed = localStorage.getItem("riskNoticed") ? true : false;

	function setNoticed() {
		riskNoticed = true;
		localStorage.setItem("riskNoticed", "true");
	}
</script>

<div class="grid relative">
	<BackButtton />

	<div class="flex flex-col mt-2">
		<span class="text-3xl/7">Deposit Euro</span>
		<span class="text-">to start earning</span>
	</div>

	<div class="text-mid text-sky-550 mt-1.5 flex gap-1">
		<img src={info} style="transform: scale(0.8) translateY(1px);" alt="info" />
		<span>1 € = 1,04 $ of Savings DAI</span>
	</div>

	<div
		class="bg-neutral-80 rounded-2xl flex px-4 py-3 mt-4 focus-within:bg-gray-200"
	>
		<div class="mr-6">
			<div class="text-xl">EUR</div>
			<div class="text-gray-450 text-xs font-normal">Balance: 10,00 €</div>
		</div>

		<input
			class="bg-transparent outline-none text-xl ml-auto h-7 w-36 text-right"
			value="10,00"
		/>
		<div class="ml-2 text-xl">€</div>
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
		class="bg-neutral-80 rounded-2xl flex px-4 py-3 focus-within:bg-gray-200 relative"
	>
		<div class="mr-6">
			<div class="text-xl">sDAI</div>
			<div class="text-gray-450 text-xs font-normal">Balance: 0,00 $</div>
		</div>

		<input
			class="bg-transparent outline-none text-xl ml-auto h-7 w-36 text-right"
			value="10,00"
		/>
		<div class="ml-2 text-xl">$</div>

		<div
			class="flex gap-1 text-gray-450 text-xs font-normal absolute right-4 bottom-3"
		>
			<img
				src={info}
				style="transform: scale(0.875) translate(2px, 1px); filter: grayscale();"
				alt="info"
			/>
			<span>after 0,01 € fee</span>
		</div>
	</div>

	<Button>Review order</Button>

	{#if !riskNoticed}
		<div
			class="absolute bg-white rounded-2xl left-0 right-0 min-h-full flex flex-col p-4 z-10"
		>
			<div class="flex justify-between p-2">
				<div class="text-base/5 mt-0.5">
					Are you aware of the risks<br /> of this savings account?
				</div>
				<img class="h-11" src={attention} alt="attention" />
			</div>

			<div class="flex flex-col gap-3 p-2 -mt-1 text-gray-450 text-xs">
				<div>
					Your Euro is pegged to DAI which is<br /> pegged to the US Dollar.
				</div>

				<div>
					There are smart contract, economic, governance, platform and personal
					risks.
				</div>

				<div>
					The 5,00% interest might change over time. We will inform you if that
					happens.
				</div>

				<div>You can withdraw your money at any time.</div>
			</div>

			<Button on:click={routing.goback}>No, go back</Button>

			<Button
				class="!text-sky-500 hover:!text-white !bg-sky-100 hover:!bg-sky-600 active:!bg-sky-700"
				on:click={setNoticed}>Yes, continue</Button
			>
		</div>
	{/if}
</div>
