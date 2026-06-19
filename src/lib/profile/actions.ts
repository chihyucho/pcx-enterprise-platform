"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ProfileActionResult = {
  success: boolean;
  error: string | null;
};

export async function updateProfileName(
  fullName: string
): Promise<ProfileActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "You must be signed in." };
  }

  const trimmed = fullName.trim();
  if (!trimmed) {
    return { success: false, error: "Name is required." };
  }

  const { error: profileError } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      full_name: trimmed,
      email: user.email,
    },
    { onConflict: "id" }
  );

  if (profileError) {
    return { success: false, error: profileError.message };
  }

  const { error: authError } = await supabase.auth.updateUser({
    data: { full_name: trimmed },
  });

  if (authError) {
    return { success: false, error: authError.message };
  }

  revalidatePath("/profile");
  revalidatePath("/portal");
  revalidatePath("/sales-system", "layout");

  return { success: true, error: null };
}

export async function updateProfileEmail(
  email: string
): Promise<ProfileActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "You must be signed in." };
  }

  const trimmed = email.trim();
  if (!trimmed) {
    return { success: false, error: "Email is required." };
  }

  const { error: authError } = await supabase.auth.updateUser({
    email: trimmed,
  });

  if (authError) {
    return { success: false, error: authError.message };
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .upsert({ id: user.id, email: trimmed }, { onConflict: "id" });

  if (profileError) {
    return { success: false, error: profileError.message };
  }

  revalidatePath("/profile");

  return {
    success: true,
    error: null,
  };
}

export async function updateProfilePassword(
  password: string
): Promise<ProfileActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "You must be signed in." };
  }

  if (password.length < 8) {
    return {
      success: false,
      error: "Password must be at least 8 characters.",
    };
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}
