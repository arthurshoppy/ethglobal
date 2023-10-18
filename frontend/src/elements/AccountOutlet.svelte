<script lang="ts">
	import { getContext } from "svelte";
	import type { createFauxBackendCtx } from "../contexts/backend";
	import type { createRoutingCtx } from "../contexts/routing";

	import dashboard from "../assets/dashboard.png";
	import transactions from "../assets/transactions.png";
	import settings from "../assets/settings.png";
	import logout from "../assets/logout.png";
	import icon from "../assets/icon.png";

	const backend =
		getContext<ReturnType<typeof createFauxBackendCtx>>("fauxBackend");

	const routing = getContext<ReturnType<typeof createRoutingCtx>>("routing");
	const currRoute = routing.route;

	let expanded = false;

	const menu = [
		{ icon: dashboard, title: "Dashboard", route: "dashboard" },
		{ icon: transactions, title: "Transactions", route: "transactions" },
		{ icon: settings, title: "Settings", route: "settings" },
	];

	function goto(route: string) {
		expanded = false;
		routing.goto(route, true);
	}

	async function signOut() {
		// TODO: use deleteAccount? here
		backend.address.set(null);

		routing.goto("signin", true);
	}
</script>

<aside class="absolute top-4 right-4">
	<button
		class="rounded-full overflow-hidden cursor-pointer bg-white border-4 border-white right-0 top-0 absolute"
		on:click={() => (expanded = !expanded)}
	>
		<img class="w-6 h-6" alt="profile" src={icon} />
	</button>

	<div
		class="mt-10 flex flex-col py-2 bg-white rounded-xl transition-all
    {!expanded && 'pointer-events-none'} {!expanded && 'opacity-0'} {expanded
			? 'translate-y-0'
			: '-translate-y-2'}"
	>
		{#each menu as item}
			<button
				class="flex py-1 px-4
        {item.route == $currRoute &&
					'bg-gray-100'} hover:bg-gray-100 active:bg-gray-200"
				on:click={() => goto(item.route)}
			>
				<img
					class="h-4 w-4 self-center mr-2.5"
					src={item.icon}
					alt={item.title}
				/>
				<div class="text-gray-600">{item.title}</div>
			</button>
		{/each}

		<div class="h-px bg-gray-200 mx-4 my-1" />

		<button class="flex hover:bg-gray-100 py-0.5" on:click={signOut}>
			<img
				class="h-4 w-4 self-center ml-4 mr-2.5"
				src={logout}
				alt="sign out icon"
			/>
			Sign out
		</button>
	</div>
</aside>
