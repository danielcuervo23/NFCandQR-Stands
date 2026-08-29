"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// =====================================================
// RESTAURANTES
// =====================================================

export async function createRestaurant(formData: FormData) {
  const supabase = await createClient();

  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const contact_name = String(formData.get("contact_name") ?? "").trim() || null;
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const address = String(formData.get("address") ?? "").trim() || null;

  if (!name || !slug) {
    return { error: "Nombre y slug son obligatorios." };
  }

  const { error } = await supabase
    .from("restaurants")
    .insert({ name, slug, contact_name, phone, address });

  if (error) return { error: error.message };

  revalidatePath("/admin/restaurants");
  return { success: true };
}

export async function updateRestaurant(id: string, formData: FormData) {
  const supabase = await createClient();

  const name = String(formData.get("name") ?? "").trim();
  const contact_name = String(formData.get("contact_name") ?? "").trim() || null;
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const address = String(formData.get("address") ?? "").trim() || null;

  const { error } = await supabase
    .from("restaurants")
    .update({ name, contact_name, phone, address })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/restaurants");
  revalidatePath(`/admin/restaurants/${id}`);
  return { success: true };
}

export async function deleteRestaurant(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("restaurants").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/restaurants");
  return { success: true };
}

// =====================================================
// STANDS
// =====================================================

export async function updateStand(id: string, formData: FormData) {
  const supabase = await createClient();

  const restaurant_id = String(formData.get("restaurant_id") ?? "") || null;
  const table_number = String(formData.get("table_number") ?? "").trim() || null;
  const nfc_target_url = String(formData.get("nfc_target_url") ?? "").trim() || null;
  const qr_target_url = String(formData.get("qr_target_url") ?? "").trim() || null;
  const is_active = formData.get("is_active") === "on";

  const { error } = await supabase
    .from("stands")
    .update({
      restaurant_id,
      table_number,
      nfc_target_url,
      qr_target_url,
      is_active,
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/stands");
  revalidatePath(`/admin/stands/${id}`);
  return { success: true };
}

export async function deleteStand(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("stands").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/stands");
  return { success: true };
}

/**
 * Crea stands en lote a partir de un prefijo y un rango numérico.
 * Ej: prefix="stand_", from=1, to=50, padding=3 -> stand_001 ... stand_050
 */
export async function createStandsBatch(formData: FormData) {
  const supabase = await createClient();

  const prefix = String(formData.get("prefix") ?? "stand_").trim();
  const from = parseInt(String(formData.get("from") ?? "1"), 10);
  const to = parseInt(String(formData.get("to") ?? "1"), 10);
  const padding = parseInt(String(formData.get("padding") ?? "3"), 10);

  if (isNaN(from) || isNaN(to) || from < 1 || to < from) {
    return { error: "Rango inválido." };
  }
  if (to - from > 500) {
    return { error: "Máximo 500 stands por lote." };
  }

  const ids = [];
  for (let n = from; n <= to; n++) {
    ids.push({ id: `${prefix}${String(n).padStart(padding, "0")}` });
  }

  const { error } = await supabase.from("stands").insert(ids);

  if (error) return { error: error.message };

  revalidatePath("/admin/stands");
  return { success: true, count: ids.length };
}

// =====================================================
// DASHBOARD
// =====================================================

export async function getDashboardStats() {
  const supabase = await createClient();

  const [
    { count: totalStands },
    { count: activeStands },
    { count: totalRestaurants },
    { count: totalNfcClicks },
    { count: totalQrClicks },
  ] = await Promise.all([
    supabase.from("stands").select("*", { count: "exact", head: true }),
    supabase
      .from("stands")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true),
    supabase.from("restaurants").select("*", { count: "exact", head: true }),
    supabase
      .from("analytics_events")
      .select("*", { count: "exact", head: true })
      .eq("source", "nfc"),
    supabase
      .from("analytics_events")
      .select("*", { count: "exact", head: true })
      .eq("source", "qr"),
  ]);

  // Clics de los últimos 14 días agrupados por día (se agregan en JS
  // porque supabase-js no agrega en SQL directamente).
  const since = new Date();
  since.setDate(since.getDate() - 14);

  const { data: recentEvents } = await supabase
    .from("analytics_events")
    .select("created_at, source")
    .gte("created_at", since.toISOString());

  const byDay: Record<string, { nfc: number; qr: number }> = {};
  for (const ev of recentEvents ?? []) {
    const day = ev.created_at.slice(0, 10);
    if (!byDay[day]) byDay[day] = { nfc: 0, qr: 0 };
    byDay[day][ev.source as "nfc" | "qr"]++;
  }

  const dailyBreakdown = Object.entries(byDay)
    .sort(([a], [b]) => (a < b ? 1 : -1))
    .map(([day, counts]) => ({ day, ...counts }));

  return {
    totalStands: totalStands ?? 0,
    activeStands: activeStands ?? 0,
    totalRestaurants: totalRestaurants ?? 0,
    totalNfcClicks: totalNfcClicks ?? 0,
    totalQrClicks: totalQrClicks ?? 0,
    dailyBreakdown,
  };
}
