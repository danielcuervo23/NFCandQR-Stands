"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createSingleStand(formData: FormData) {
  const supabase = await createClient();

  const id = String(formData.get("id") ?? "").trim();
  const restaurant_id = String(formData.get("restaurant_id") ?? "") || null;
  const table_number = String(formData.get("table_number") ?? "").trim() || null;
  const nfc_target_url = String(formData.get("nfc_target_url") ?? "").trim() || null;
  const qr_target_url = String(formData.get("qr_target_url") ?? "").trim() || null;

  if (!id) return { error: "El ID del stand es obligatorio (ej: stand_001)." };

  const { error } = await supabase.from("stands").insert({
    id,
    restaurant_id,
    table_number,
    nfc_target_url,
    qr_target_url,
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/stands");
  redirect(`/admin/stands/${id}`);
}
