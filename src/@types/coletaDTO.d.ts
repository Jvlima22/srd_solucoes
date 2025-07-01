interface coletaDTO {
  coleta: number;
  totalDocumento: number;
  volume: number | null;
  peso: string;
  destinatario: string | null;
  cidade: string | null;
  uf: string | null;
  status: string | null;
  tipo_acao: number;
}
