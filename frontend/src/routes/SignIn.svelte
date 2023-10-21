<script lang="ts">
	import { getContext } from "svelte";

	import type { createFauxBackendCtx } from "../contexts/backend";
	import type { createRoutingCtx } from "../contexts/routing";

	import logo from "../assets/logo.png";
	import passkey from "../assets/passkey.png";
	import google from "../assets/google.png";
	import loading from "../assets/loading.gif";

	const backend =
		getContext<ReturnType<typeof createFauxBackendCtx>>("fauxBackend");

	const routing = getContext<ReturnType<typeof createRoutingCtx>>("routing");

	let signingIn = false;

	async function signIn() {
		signingIn = true;

		await backend.initializeWallet();
		await backend.connectWallet();

		routing.goto("dashboard", true);
	}
</script>

<div class="flex flex-col">
	<img src={logo} alt="logo" class="w-20 h-20 mx-auto" />

	<div class="text-center text-2xl mt-2 mb-8">DaiDaddy</div>

	<button
		disabled={signingIn}
		class="flex mx-auto items-center border border-neutral-200 rounded-full px-4 py-2 gap-2 hover:bg-neutral-200 active:bg-neutral-300 transition-colors mb-2
		{signingIn && 'opacity-60 pointer-events-none'} bg-white"
	>
		<img class="w-5 h-5 opacity-90 ml-1" src={google} alt="google logo" />
		<span class="text-center mr-auto">Sign in with Passkey</span>
	</button>

	<button
		disabled={signingIn}
		class="flex mx-auto items-center border border-neutral-200 rounded-full px-4 py-2 gap-2 hover:bg-neutral-200 active:bg-neutral-300 transition-colors
		{signingIn && 'pointer-events-none'} bg-white"
		on:click={signIn}
	>
		<img
			class="w-5 h-5 opacity-80 ml-1"
			src={signingIn ? loading : passkey}
			alt="passkey symbol"
		/>
		<span class="text-center mr-auto">Sign in with Passkey</span>
	</button>
</div>
