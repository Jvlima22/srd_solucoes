interface despachoDTO {
  frete: number;
  minutaDespacho: number | null;
  CTE: string;
  destino: string | null;
  cidade: string | null;
  uf: string | null;
  status: string | null;
  tipo_acao: number;
}
