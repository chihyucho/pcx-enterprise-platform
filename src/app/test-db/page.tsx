import { createClient } from "@/lib/supabase/client";

export default async function TestDBPage() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("accounts")
    .select("*");

  return (
    <pre>
      {JSON.stringify({ data, error }, null, 2)}
    </pre>
  );
}