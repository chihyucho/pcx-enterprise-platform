export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
    );
  }

  if (url.includes("your-project-url") || anonKey.includes("your-anon-key")) {
    throw new Error(
      "Supabase environment variables are still placeholders. Update .env.local with your project URL and anon key."
    );
  }

  return { url, anonKey };
}
