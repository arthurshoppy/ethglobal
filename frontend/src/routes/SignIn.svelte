<script lang="ts">
	import { getContext } from "svelte";

	import type { createFauxBackendCtx } from "../contexts/backend";
	import type { createRoutingCtx } from "../contexts/routing";
	import Button from "../elements/Button.svelte";

	import logo from "../assets/logo.png";
	import bolt from "../assets/bolt.png";

	const backend =
		getContext<ReturnType<typeof createFauxBackendCtx>>("fauxBackend");

	const routing = getContext<ReturnType<typeof createRoutingCtx>>("routing");

	async function signIn() {
		// backend.address.set("0xB4Aa0cCbb67276E08283EF43D7c95132C71A274C");

		await backend.initializeWallet();
		await backend.connectWallet();
		// await backend.depositSDAI("1");

		routing.goto("dashboard", true);
	}
</script>

<div class="flex flex-col">
	<img src={logo} alt="logo" class="w-20 h-20 mx-auto" />

	<div class="text-center text-2xl mt-1 mb-8">DaiDaddy</div>

	<Button class="flex mx-auto" on:click={signIn}>
		<img class="w-6 h-6 -ml-2 mr-1" src={bolt} alt="discord logo" />
		<span class="text-center mr-auto">Sign In</span>
	</Button>
</div>
