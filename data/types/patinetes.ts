export interface Localizacao {
  lat: number;
  lng: number;
}

export type StatusPatinete = 'disponivel' | 'reservado' | 'em_uso';

export interface Patinete {
  id: number;
  bateria: number; // porcentagem
  localizacao: Localizacao;
  precoPorMinuto: number;
  status: StatusPatinete;
  imagem: string; // referência para a imagem
  modelo: string;
  cor: string;
}
