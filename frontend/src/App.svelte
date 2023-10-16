<script lang="ts">
	import { getContext, setContext } from "svelte";
	import { createRoutingCtx } from "./contexts/routing";
	import AccountOutlet from "./elements/AccountOutlet.svelte";
	import { createFauxBackendCtx } from "./contexts/backend";

	setContext("fauxBackend", createFauxBackendCtx());
	const backend =
		getContext<ReturnType<typeof createFauxBackendCtx>>("fauxBackend");
	const address = backend.address;

	setContext("routing", createRoutingCtx());
	const routing = getContext<ReturnType<typeof createRoutingCtx>>("routing");
	const routeCompontent = routing.routeComponent;
</script>

<main class="h-screen w-screen grid">
	{#if $address}
		<AccountOutlet />
	{/if}

	<outlet id="outlet" class="m-auto">
		<svelte:component this={$routeCompontent} />
	</outlet>
</main>
