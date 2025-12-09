import { User } from "../../types/user";
import { supabase } from "../lib/supabase";

export const UsersService = {
  async getAll(): Promise<User[]> {
    const { data, error } = await supabase.from("users").select("*");
    if (error) throw error;
    return (data as User[]) || [];
  },

  async getById(id: string): Promise<User> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as User;
  },

  async create(user: Omit<User, "id">): Promise<User> {
    const { data, error } = await supabase
      .from("users")
      .insert([user])
      .select()
      .single();
    if (error) throw error;
    return data as User;
  },

  async update(id: string, updates: Partial<User>): Promise<User> {
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as User;
  },

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase.from("users").delete().eq("id", id);
    if (error) throw error;
    return true;
  },
};