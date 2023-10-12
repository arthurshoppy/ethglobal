<script lang="ts">
  import { getContext } from "svelte";
  import type { createAuthCtx } from "../contexts/auth";

  import at from "../assets/at.png";
  import lock from "../assets/lock.png";
  import dcLogo from "../assets/dc.png";

  const auth = getContext<ReturnType<typeof createAuthCtx>>("auth");
  const supabase = auth.getClient();

  function signInWithDiscord() {
    supabase.auth.signInWithOAuth({
      provider: "discord",
    });
  }
</script>

<div class="flex flex-col gap-4">
  <div class="text-center text-xl mb-6">Sign In to start</div>

  <div class="flex flex-col gap-2">
    <div class="flex gap-1 bg-white border border-gray-200 focus-within:border-gray-400 rounded-lg pl-2 py-1 w-52">
      <img class="w-4 h-4 self-center" src={at} alt="email symbol" />
      <input class="bg-transparent text-sm font-normal outline-none text-gray-500 w-full pr-0.5" placeholder="Email" />
    </div>
    <div class="flex gap-1 bg-white border border-gray-200 focus-within:border-gray-400 rounded-lg pl-2 py-1">
      <img class="w-4 h-4 self-center" src={lock} alt="password symbol" />
      <input class="bg-transparent text-sm font-normal outline-none text-gray-500 w-full pr-0.5" placeholder="Password" />
    </div>
  </div>

  <div class="flex items-center my-4">
    <div class="h-px bg-gray-300 grow" />
    <div class="mx-2 text-gray-400 font-normal text-mid select-none">Or</div>
    <div class="h-px bg-gray-300 grow" />
  </div>

  <button
    class="font-semibold text-mid bg-[#7187dd] hover:bg-[#6a7ecf] active:bg-[#596aaf] mx-auto px-2.5 py-2 rounded text-white select-none flex gap-2 items-center transition-colors"
    on:click={signInWithDiscord}
  >
    <img class="w-4 h-4" src={dcLogo} alt="discord logo" />
    Sign in with Discord
  </button>
</div>
