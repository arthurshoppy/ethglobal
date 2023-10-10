<script lang="ts">
  import { getContext, setContext } from "svelte";
  import { createRoutingCtx } from "./contexts/routing";
  import AccountOutlet from "./elements/AccountOutlet.svelte";

  setContext("routing", createRoutingCtx());

  const routing = getContext<ReturnType<typeof createRoutingCtx>>("routing");
  const routeCompontent = routing.routeComponent;
</script>

<main class="h-screen w-screen grid">
  <aside class="absolute top-4 left-4">
    <AccountOutlet />
  </aside>

  <outlet class="m-auto">
    {#if $routeCompontent}
      <svelte:component this={$routeCompontent} />
    {/if}
  </outlet>
</main>
