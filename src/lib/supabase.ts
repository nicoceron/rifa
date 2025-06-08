import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types (we'll update these after creating the schema)
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      raffles: {
        Row: {
          id: string;
          title: string;
          description: string;
          image_url: string | null;
          goal_amount: number;
          raised_amount: number;
          ticket_price: number;
          tickets_total: number;
          tickets_sold: number;
          category: string;
          status: "active" | "completed" | "cancelled";
          organizer_id: string;
          organizer_name: string;
          start_date: string;
          end_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          image_url?: string | null;
          goal_amount: number;
          raised_amount?: number;
          ticket_price: number;
          tickets_total: number;
          tickets_sold?: number;
          category: string;
          status?: "active" | "completed" | "cancelled";
          organizer_id: string;
          organizer_name: string;
          start_date: string;
          end_date: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          image_url?: string | null;
          goal_amount?: number;
          raised_amount?: number;
          ticket_price?: number;
          tickets_total?: number;
          tickets_sold?: number;
          category?: string;
          status?: "active" | "completed" | "cancelled";
          organizer_id?: string;
          organizer_name?: string;
          start_date?: string;
          end_date?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      tickets: {
        Row: {
          id: string;
          raffle_id: string;
          participant_email: string;
          participant_name: string;
          ticket_number: number;
          purchase_date: string;
          payment_status: "pending" | "completed" | "failed";
          payment_amount: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          raffle_id: string;
          participant_email: string;
          participant_name: string;
          ticket_number: number;
          purchase_date?: string;
          payment_status?: "pending" | "completed" | "failed";
          payment_amount: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          raffle_id?: string;
          participant_email?: string;
          participant_name?: string;
          ticket_number?: number;
          purchase_date?: string;
          payment_status?: "pending" | "completed" | "failed";
          payment_amount?: number;
          created_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          icon: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          icon?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          icon?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
};
