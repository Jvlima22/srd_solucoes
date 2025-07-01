export interface DetalhesDespachoDTO {
  numero_minuta: number;
  frete: number;
  ocorrencias: {
    id: number;
    documento: string;
    ocorrencia: string;
    data: string;
    hora: string;
    excluir: boolean;
  }[];
}
