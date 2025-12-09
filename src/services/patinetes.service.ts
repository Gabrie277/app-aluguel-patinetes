import { Patinete } from "../../types/patinete";
import { supabase } from "../lib/supabase";

export const PatinetesService = {
  async getAll(): Promise<Patinete[]> {
    const { data, error } = await supabase.from("patinetes").select("*");
    if (error) throw error;
    return data;
  },

  async updateLocation(id: string, latitude: number, longitude: number) {
    const { data, error } = await supabase
      .from("patinetes")
      .update({ latitude, longitude })
      .eq("id", id)
      .select();

    if (error) throw error;
    return data;
  },

  async create(patinete: Omit<Patinete, "id">) {
    const { data, error } = await supabase
      .from("patinetes")
      .insert(patinete)
      .select();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Patinete>) {
    const { data, error } = await supabase
      .from("patinetes")
      .update(updates)
      .eq("id", id)
      .select();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase.from("patinetes").delete().eq("id", id);
    if (error) throw error;
    return true;
  },
};
