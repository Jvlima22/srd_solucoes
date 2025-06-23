interface OcorrenciaDTO {
  numero: number;
  ocorrencia: string;
  data: string;
  hora: string;
  excluir: boolean;
}

interface DetalhesEntregaDTO {
  documento: number | null;
  frete: string;
  ocorrencias: OcorrenciaDTO[];
}
