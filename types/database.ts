export interface Database {
  public: {
    Tables: {
      reviews: {
        Row: {
          id: string
          wine_id: number
          is_custom: boolean
          rating: number
          body: number
          sweetness: number
          acidity: number
          tannin: number
          comment: string
          nickname: string
          created_at: string
        }
        Insert: Omit<
          Database["public"]["Tables"]["reviews"]["Row"],
          "id" | "created_at"
        > & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database["public"]["Tables"]["reviews"]["Insert"]>
        Relationships: []
      }
      custom_wines: {
        Row: {
          wine_id: number
          wine_nm: string
          wine_nm_kr: string
          wine_area: string
          wine_category: string
          wine_abv: number
          wine_prc: number
          created_at: string
        }
        Insert: Omit<
          Database["public"]["Tables"]["custom_wines"]["Row"],
          "wine_id" | "created_at"
        > & {
          wine_id?: number
          created_at?: string
        }
        Update: Partial<Database["public"]["Tables"]["custom_wines"]["Insert"]>
        Relationships: []
      }
      review_tokens: {
        Row: {
          review_id: string
          token: string
          expires_at: string
        }
        Insert: Database["public"]["Tables"]["review_tokens"]["Row"]
        Update: Partial<Database["public"]["Tables"]["review_tokens"]["Row"]>
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
