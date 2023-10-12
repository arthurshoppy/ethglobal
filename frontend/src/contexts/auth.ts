import { readable } from "svelte/store";
import { type User, createClient } from '@supabase/supabase-js'
import { consistentStore } from "../helpers/reactivity-helpers";

function getClient() {
  const client =
    (window as unknown as { client: ReturnType<typeof createClient> }).client ??
    createClient(
      "https://cjcstovfmmzswixooike.supabase.co", // TODO: secure this key
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqY3N0b3ZmbW16c3dpeG9vaWtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTY5NDg1MzYsImV4cCI6MjAxMjUyNDUzNn0.1O5HeDtfvcJ-oFJVXKF_5LAu4Icb2fRikcBd38H0uTk"
    );
  (window as unknown as any).client = client;
  return client;
}

export function createAuthCtx() {
    const supabase = getClient()

    const ctx = {
      user: consistentStore(readable<User | null | undefined>(undefined, (set) => {
        supabase.auth.onAuthStateChange((e, s) => {
          switch (e) {
            case "INITIAL_SESSION":
            case "SIGNED_IN": {
              set(s?.user || null)
              break;
            }
            case "SIGNED_OUT": {
              set(null)
              break;
            }
          }
        })

        supabase.auth.getUser()
      })),

      getClient() {
        return supabase;
      },

      signOut() {
        supabase.auth.signOut()
      }
    }

    ctx.user.subscribe(u => console.log("User", u))

    return ctx
}