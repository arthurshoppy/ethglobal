<script lang="ts">
  import { getContext } from "svelte";
  import type { createAuthCtx } from "../contexts/auth";

  import dcLogo from "../assets/dc.png";

  const auth = getContext<ReturnType<typeof createAuthCtx>>("auth");
  const supabase = auth.getClient();

  function signInWithDiscord() {
    supabase.auth.signInWithOAuth({
      provider: "discord",
    });
  }
</script>

<div>
  <button
    class="font-semibold text-mid bg-[#7187dd] hover:bg-[#6a7ecf] active:bg-[#596aaf] px-2.5 py-2 rounded text-white select-none flex gap-2 items-center transition-colors"
    on:click={signInWithDiscord}
  >
    <img class="w-4 h-4" src={dcLogo} alt="discord logo" />
    Sign in with Discord
  </button>
</div>
