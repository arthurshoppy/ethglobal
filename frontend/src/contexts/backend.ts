// https://supabase.com/docs/reference/javascript/installing
import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const supabase = createClient(
  "https://cjcstovfmmzswixooike.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqY3N0b3ZmbW16c3dpeG9vaWtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTY5NDg1MzYsImV4cCI6MjAxMjUyNDUzNn0.1O5HeDtfvcJ-oFJVXKF_5LAu4Icb2fRikcBd38H0uTk"
)

const { data, error } = await supabase.functions.invoke('hello-world', {
  body: { name: 'Functions' },
})