// lib/types.ts

export interface UserProfile {
  id: string;
  email: string;
  username: string | null;
  full_name: string | null;
  phone: string | null;
  gender: "Laki-laki" | "Perempuan" | "Lainnya" | null;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  theme: "light" | "dark" | "system";
  created_at: string;
  updated_at: string;
}