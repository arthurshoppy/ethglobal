<script lang="ts">
  import { getContext } from "svelte";
  import type { createRoutingCtx } from "../contexts/routing";

  const auth = getContext<ReturnType<typeof createAuthCtx>>("auth");
  const user = auth.user;

  const routing = getContext<ReturnType<typeof createRoutingCtx>>("routing");
  const currRoute = routing.route;

  import profile from "../assets/profile.png";

  import dashboard from "../assets/dashboard.png";
  import transactions from "../assets/transactions.png";
  import settings from "../assets/settings.png";
  import type { createAuthCtx } from "../contexts/auth";

  let expanded = false;

  const menu = [
    { icon: dashboard, title: "Dashboard", route: "home" },
    { icon: transactions, title: "Transactions", route: "transactions" },
    { icon: settings, title: "Settings", route: "settings" },
  ];

  function goto(route: string) {
    expanded = false;
    routing.goto(route, true);
  }
</script>

<div>
  <button class="rounded-full overflow-hidden cursor-pointer bg-white shadow" on:click={() => (expanded = !expanded)}>
    <img class="w-8 h-8" alt="profile" src={$user?.user_metadata?.picture || profile} />
  </button>

  <div
    class="mt-2 flex flex-col py-2 bg-white rounded-xl shadow transition-all
    {!expanded && 'pointer-events-none'} {!expanded && 'opacity-0'} {expanded ? 'translate-y-0' : '-translate-y-2'}"
  >
    {#each menu as item}
      <button
        class="flex py-1 px-4
        {item.route == $currRoute && 'bg-gray-100'} hover:bg-gray-100 active:bg-gray-200"
        on:click={() => goto(item.route)}
      >
        <img class="h-4 w-4 self-center mr-1" src={item.icon} alt={item.title} />
        <div class="text-gray-600">{item.title}</div>
      </button>
    {/each}
    <button on:click={auth.signOut}>sign out</button>
  </div>
</div>
