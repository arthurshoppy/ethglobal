<script lang="ts">
  import { getContext } from "svelte";
  import type { createRoutingCtx } from "../contexts/routing";

  import arrowLeft from "../assets/arrow-left.png";

  const routing = getContext<ReturnType<typeof createRoutingCtx>>("routing");
</script>

{#if routing.cangoback}
  <button
    class="text-xs text-gray-400 font-normal mr-auto px-1 py-1 rounded-full hover:bg-gray-200 transition-colors"
    on:click={routing.goback}
  >
    <img class="h-4" src={arrowLeft} alt="arrow left" />
  </button>
{/if}
