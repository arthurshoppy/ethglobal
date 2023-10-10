<script lang="ts">
  import { getContext } from "svelte";
  import type { createRoutingCtx } from "../contexts/routing";

  const routing = getContext<ReturnType<typeof createRoutingCtx>>("routing");
</script>

{#if routing.cangoback}
  <button
    class="text-xs text-gray-400 font-normal mr-auto px-1 py-px rounded-lg hover:bg-gray-200 transition-colors duration-200"
    on:click={routing.goback}
  >
    {"<"}
  </button>
{/if}
