<script lang="ts">
	import BackButtton from "../elements/BackButtton.svelte";

	import info from "../assets/info.png";

	import arrowSwap from "../assets/arrow-swap.png";
	import Button from "../elements/Button.svelte";
	import RiskNotice from "../elements/RiskNotice.svelte";
</script>

<div class="grid relative">
	<BackButtton />

	<div class="flex flex-col mt-2">
		<span class="text-3xl/7">Earn on Savings DAI</span>
		<span class="text-green-500">5,00 % per year</span>
	</div>

	<div class="text-mid mt-1.5 flex gap-1">
		<img
			src={info}
			class="grayscale brightness-50"
			style="transform: scale(0.8) translateY(1px);"
			alt="info"
		/>
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

	<RiskNotice
		key="dai"
		desc="Your Euro is pegged to DAI which is pegged to the US Dollar."
	/>
</div>
