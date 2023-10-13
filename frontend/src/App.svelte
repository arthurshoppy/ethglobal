<script lang="ts">
  import { getContext, setContext } from "svelte";
  import { createRoutingCtx } from "./contexts/routing";
  import AccountOutlet from "./elements/AccountOutlet.svelte";
  import { createAuthCtx } from "./contexts/auth";
  import SignIn from "./routes/SignIn.svelte";
  import { createFauxBackendCtx } from "./contexts/backend";

  setContext("fauxBackend", createFauxBackendCtx());
  const backend = getContext<ReturnType<typeof createAuthCtx>>("fauxBackend");

  setContext("auth", createAuthCtx());
  const auth = getContext<ReturnType<typeof createAuthCtx>>("auth");
  const user = auth.user;

  setContext("routing", createRoutingCtx());
  const routing = getContext<ReturnType<typeof createRoutingCtx>>("routing");
  const routeCompontent = routing.routeComponent;
</script>

<main class="h-screen w-screen grid">
  <aside class="absolute top-4 left-4">
    {#if !!$user}
      <AccountOutlet />
    {/if}
  </aside>

  <outlet id="outlet" class="m-auto">
    {#if $user === undefined}
      ...
    {:else if $user}
      <svelte:component this={$routeCompontent} />
    {:else}
      <SignIn />
    {/if}
  </outlet>
</main>
