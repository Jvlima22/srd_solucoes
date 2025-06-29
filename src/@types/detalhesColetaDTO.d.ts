export interface DetalhesColetaDTO {
  "Numero da coleta": number;
  ocorrencias: {
    id: number;
    documentos: string;
    nome_ocorrencia: string;
    data_ocorrencia: string;
    hora_ocorrencia: string;
  }[];
}
