export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      phones: {
        Row: {
          id: string;
          name: string;
          brand: string;
          series: string | null;
          category: string;
          category_name: string | null;
          price: number;
          price_formatted: string | null;
          antutu: number;
          antutu_formatted: string | null;
          processor: string | null;
          ram: string | null;
          storage: string | null;
          display: Json;
          battery: Json;
          camera: Json;
          audio: Json;
          os: Json;
          connectivity: Json;
          build: Json;
          biometrics: string | null;
          image_url: string | null;
          is_flat: boolean;
          has_jack: boolean;
          has_ois: boolean;
          is_clean_os: boolean;
          is_compact: boolean;
          ip_rating: string | null;
          weight: string | null;
          weight_g: number | null;
          highlights: string[];
          pros: string[];
          cons: string[];
          editorial_verdict: string | null;
          release_year: number | null;
          similar_phones: string[];
          verified_date: string | null;
          sources: string[];
          data: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          brand: string;
          series?: string | null;
          category: string;
          category_name?: string | null;
          price?: number;
          price_formatted?: string | null;
          antutu?: number;
          antutu_formatted?: string | null;
          processor?: string | null;
          ram?: string | null;
          storage?: string | null;
          display?: Json;
          battery?: Json;
          camera?: Json;
          audio?: Json;
          os?: Json;
          connectivity?: Json;
          build?: Json;
          biometrics?: string | null;
          image_url?: string | null;
          is_flat?: boolean;
          has_jack?: boolean;
          has_ois?: boolean;
          is_clean_os?: boolean;
          is_compact?: boolean;
          ip_rating?: string | null;
          weight?: string | null;
          weight_g?: number | null;
          highlights?: string[];
          pros?: string[];
          cons?: string[];
          editorial_verdict?: string | null;
          release_year?: number | null;
          similar_phones?: string[];
          verified_date?: string | null;
          sources?: string[];
          data?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          brand?: string;
          series?: string | null;
          category?: string;
          category_name?: string | null;
          price?: number;
          price_formatted?: string | null;
          antutu?: number;
          antutu_formatted?: string | null;
          processor?: string | null;
          ram?: string | null;
          storage?: string | null;
          display?: Json;
          battery?: Json;
          camera?: Json;
          audio?: Json;
          os?: Json;
          connectivity?: Json;
          build?: Json;
          biometrics?: string | null;
          image_url?: string | null;
          is_flat?: boolean;
          has_jack?: boolean;
          has_ois?: boolean;
          is_clean_os?: boolean;
          is_compact?: boolean;
          ip_rating?: string | null;
          weight?: string | null;
          weight_g?: number | null;
          highlights?: string[];
          pros?: string[];
          cons?: string[];
          editorial_verdict?: string | null;
          release_year?: number | null;
          similar_phones?: string[];
          verified_date?: string | null;
          sources?: string[];
          data?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
        };
      };
      brands: {
        Row: {
          id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
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
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type PhoneRow = Database['public']['Tables']['phones']['Row'];
export type PhoneInsert = Database['public']['Tables']['phones']['Insert'];
export type CategoryRow = Database['public']['Tables']['categories']['Row'];
export type BrandRow = Database['public']['Tables']['brands']['Row'];
