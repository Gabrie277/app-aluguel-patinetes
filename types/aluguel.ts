export interface Aluguel {
  id: string;
  userId: string;
  patineteId: string;
  inicio: string;
  fim?: string;
  ativo: boolean;
}
