export interface DetalhesColetaDTO {
  coleta: number;
  documento: string | null;
  ocorrencia: string;
  dataOcorrencia: string | null;
  horaOcorrencia: string | null;
}
