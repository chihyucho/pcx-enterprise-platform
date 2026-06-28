import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function TestDBPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  const supabase = await createClient();

  const { data, error } = await supabase.from("accounts").select("*");

  return (
    <pre className="p-4 text-xs">
      {JSON.stringify({ data, error }, null, 2)}
    </pre>
  );
}
