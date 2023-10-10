<script lang="ts">
  import Button from "../elements/Button.svelte";

  import { getContext } from "svelte";
  import type { createRoutingCtx } from "../contexts/routing";

  const routing = getContext<ReturnType<typeof createRoutingCtx>>("routing");
</script>

<div class="grid gap-4">
  <div class="bg-white rounded-2xl flex px-6 py-5">
    <div class="mr-12">
      <div class="text-lg font-bold">0 €</div>
      <div class="text-neutral-380 text-mid font-normal">Total balance</div>
    </div>

    <Button smol={true} on:click={() => routing.goto("addfunds")}>Add money</Button>
  </div>

  <div class="bg-white rounded-2xl flex flex-col px-6 py-5">
    <div class="mx-auto">Earn 5,00% interest</div>
    <div class="text-neutral-380 text-mid font-normal text-center">Start by adding money to your account.</div>

    <Button smol={true} disabled={false} on:click={() => routing.goto("earn")}>Add money</Button>
  </div>
</div>
