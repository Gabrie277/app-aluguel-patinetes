
export interface Aluguel {
  id: number;
  patineteId: number;
  inicio: string; // ISO Date string
  fim: string | null;
  tempoMinutos: number | null;
  distanciaKm: number | null;
  valorTotal: number | null;
  status: 'finalizado' | 'em_andamento';
}
