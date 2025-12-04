import { Aluguel } from "../../types/aluguel";
import { supabase } from "../lib/supabase";

export const AlugueisService = {
  async getAll(): Promise<Aluguel[]> {
    const { data, error } = await supabase.from("alugueis").select("*");
    if (error) throw error;
    return data;
  },

  async startRental(payload: Omit<Aluguel, "id" | "fim" | "ativo">) {
    const { data, error } = await supabase
      .from("alugueis")
      .insert({ ...payload, ativo: true })
      .select();

    if (error) throw error;
    return data;
  },

  async finishRental(id: string) {
    const { data, error } = await supabase
      .from("alugueis")
      .update({ ativo: false, fim: new Date().toISOString() })
      .eq("id", id)
      .select();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase.from("alugueis").delete().eq("id", id);
    if (error) throw error;
    return true;
  },
};
