"use client";

import { supabase } from "@/lib/supabase/client";

export default function Home() {
  console.log(supabase);

  return <div>PCX Enterprise Platform</div>;
}