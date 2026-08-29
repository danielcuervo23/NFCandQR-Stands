export type Source = "nfc" | "qr";

export type Restaurant = {
  id: string;
  name: string;
  slug: string;
  contact_name: string | null;
  phone: string | null;
  address: string | null;
  created_at: string;
}

export type Stand = {
  id: string;
  restaurant_id: string | null;
  table_number: string | null;
  nfc_target_url: string | null;
  qr_target_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type AnalyticsEvent = {
  id: number;
  stand_id: string;
  source: Source;
  target_url: string | null;
  user_agent: string | null;
  created_at: string;
}

/**
 * Tipado mínimo de la base de datos para @supabase/ssr.
 * Si más adelante generas los tipos oficiales con
 * `supabase gen types typescript`, puedes reemplazar este archivo.
 */
export type Database = {
  public: {
    Tables: {
      restaurants: {
        Row: Restaurant;
        Insert: Partial<Restaurant> & { name: string; slug: string };
        Update: Partial<Restaurant>;
        Relationships: [];
      };
      stands: {
        Row: Stand;
        Insert: Partial<Stand> & { id: string };
        Update: Partial<Stand>;
        Relationships: [
          {
            foreignKeyName: "stands_restaurant_id_fkey";
            columns: ["restaurant_id"];
            isOneToOne: false;
            referencedRelation: "restaurants";
            referencedColumns: ["id"];
          },
        ];
      };
      analytics_events: {
        Row: AnalyticsEvent;
        Insert: Partial<AnalyticsEvent> & { stand_id: string; source: Source };
        Update: Partial<AnalyticsEvent>;
        Relationships: [
          {
            foreignKeyName: "analytics_events_stand_id_fkey";
            columns: ["stand_id"];
            isOneToOne: false;
            referencedRelation: "stands";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      v_stand_click_totals: {
        Row: { stand_id: string; source: Source; total_clicks: number };
        Relationships: [];
      };
      v_clicks_by_day: {
        Row: { day: string; source: Source; total_clicks: number };
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
