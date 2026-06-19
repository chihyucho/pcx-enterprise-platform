import { createClient } from "@/lib/supabase/server";

export type UserDisplayInfo = {
  id: string;
  email: string;
  fullName: string | null;
};

export async function getUserDisplayInfo(): Promise<UserDisplayInfo | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .maybeSingle();

  const metadataName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : null;

  return {
    id: user.id,
    email: user.email ?? profile?.email ?? "",
    fullName: profile?.full_name?.trim() || metadataName?.trim() || null,
  };
}

export function userDisplayLabel(info: UserDisplayInfo): string {
  return info.fullName || info.email || "User";
}
