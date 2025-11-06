// TypeScript types generated from Supabase schema
// This file should ideally be auto-generated using: npx supabase gen types typescript

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          phone: string | null
          national_id: string | null
          role: 'citizen' | 'agent' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          phone?: string | null
          national_id?: string | null
          role?: 'citizen' | 'agent' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          phone?: string | null
          national_id?: string | null
          role?: 'citizen' | 'agent' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      requests: {
        Row: {
          id: string
          citizen_id: string | null
          type_of_act: 'birth' | 'marriage' | 'death'
          person_fullname: string
          father_name: string | null
          mother_name: string | null
          date_of_birth: string | null
          place_of_birth: string | null
          number_of_copies: number
          purpose: string | null
          status: 'pending' | 'in_review' | 'approved' | 'rejected' | 'ready_for_pickup' | 'delivered'
          attachments: Json
          assigned_to: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          citizen_id?: string | null
          type_of_act: 'birth' | 'marriage' | 'death'
          person_fullname: string
          father_name?: string | null
          mother_name?: string | null
          date_of_birth?: string | null
          place_of_birth?: string | null
          number_of_copies?: number
          purpose?: string | null
          status?: 'pending' | 'in_review' | 'approved' | 'rejected' | 'ready_for_pickup' | 'delivered'
          attachments?: Json
          assigned_to?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          citizen_id?: string | null
          type_of_act?: 'birth' | 'marriage' | 'death'
          person_fullname?: string
          father_name?: string | null
          mother_name?: string | null
          date_of_birth?: string | null
          place_of_birth?: string | null
          number_of_copies?: number
          purpose?: string | null
          status?: 'pending' | 'in_review' | 'approved' | 'rejected' | 'ready_for_pickup' | 'delivered'
          attachments?: Json
          assigned_to?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      request_events: {
        Row: {
          id: string
          request_id: string
          actor_id: string | null
          previous_status: string | null
          new_status: string
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          request_id: string
          actor_id?: string | null
          previous_status?: string | null
          new_status: string
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          request_id?: string
          actor_id?: string | null
          previous_status?: string | null
          new_status?: string
          comment?: string | null
          created_at?: string
        }
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
  }
}

// Convenience types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Request = Database['public']['Tables']['requests']['Row']
export type RequestEvent = Database['public']['Tables']['request_events']['Row']

export type ActType = 'birth' | 'marriage' | 'death'
export type RequestStatus = 'pending' | 'in_review' | 'approved' | 'rejected' | 'ready_for_pickup' | 'delivered'
export type UserRole = 'citizen' | 'agent' | 'admin'

export type Attachment = {
  name: string
  path: string
  size: number
  type: string
}

