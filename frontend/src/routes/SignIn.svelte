<script lang="ts">
  import { createClient } from "@supabase/supabase-js";
  import { onMount } from "svelte";
  import { getContext } from "svelte";
  import type { createRoutingCtx } from "../contexts/routing";

  const routing = getContext<ReturnType<typeof createRoutingCtx>>("routing");

  // Create a single supabase client for interacting with your database
  const supabase =
    (window as unknown as any).client ??
    createClient(
      "https://cjcstovfmmzswixooike.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqY3N0b3ZmbW16c3dpeG9vaWtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTY5NDg1MzYsImV4cCI6MjAxMjUyNDUzNn0.1O5HeDtfvcJ-oFJVXKF_5LAu4Icb2fRikcBd38H0uTk"
    );
  (window as unknown as any).client = supabase;

  onMount(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log(user);
    if (user) {
      routing.goto("home");
    }
  });

  async function signInWithDiscord() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "discord",
    });
    console.log(data, error);
  }
</script>

<div>
  Hello World!
  <button on:click={signInWithDiscord}>Sign up with Discord!</button>
</div>
