<script lang="ts">
	import { getContext } from "svelte";
	import type { createRoutingCtx } from "../contexts/routing";
	import Button from "./Button.svelte";

	import attention from "../assets/attention.png";

	export let key = "";
	export let percentage = "0,00";
	export let desc = "";

	const routing = getContext<ReturnType<typeof createRoutingCtx>>("routing");

	let riskNoticed = localStorage.getItem("riskNoticed" + key) ? true : false;

	function setNoticed() {
		riskNoticed = true;
		localStorage.setItem("riskNoticed" + key, "true");
	}
</script>

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

		<div class="flex flex-col gap-3 p-2 -mt-1 text-gray-450 text-mid">
			<div>
				{desc}
			</div>

			<div>
				There are smart contract, economic, governance, platform and personal
				risks.
			</div>

			<div>
				The {percentage} % interest might change over time. We will inform you if
				that happens.
			</div>

			<div>You can withdraw your money at any time.</div>
		</div>

		<Button class="mt-2" on:click={routing.goback}>No, go back</Button>

		<Button
			class="!text-sky-500 hover:!text-white !bg-sky-100 hover:!bg-sky-600 active:!bg-sky-700 mt-2"
			on:click={setNoticed}>Yes, continue</Button
		>
	</div>
{/if}
