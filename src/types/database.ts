import type {
  Business,
  BusinessMember,
  Customer,
  LaundryTransaction,
  Profile,
  Service,
  ServicePrice,
} from './models';

export interface Database {
  public: {
    Tables: {
      businesses: {
        Row: Business;
        Insert: Omit<Business, 'created_at' | 'updated_at'> & { created_at?: string; updated_at?: string };
        Update: Partial<Omit<Business, 'id'>>;
        Relationships: [];
      };
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'> & { created_at?: string; updated_at?: string };
        Update: Partial<Omit<Profile, 'id'>>;
        Relationships: [];
      };
      business_members: {
        Row: BusinessMember;
        Insert: Omit<BusinessMember, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<BusinessMember, 'id'>>;
        Relationships: [];
      };
      customers: {
        Row: Customer;
        Insert: Omit<Customer, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Customer, 'id'>>;
        Relationships: [];
      };
      services: {
        Row: Service;
        Insert: Omit<Service, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Service, 'id'>>;
        Relationships: [];
      };
      service_prices: {
        Row: ServicePrice;
        Insert: Omit<ServicePrice, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<ServicePrice, 'id'>>;
        Relationships: [];
      };
      transactions: {
        Row: LaundryTransaction;
        Insert: Omit<LaundryTransaction, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<LaundryTransaction, 'id'>>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
