export interface DetalhesDespachoDTO {
  numero_minuta: number;
  frete: number;
  documento: number | string;
  ocorrencias: string;
  data: string;
  hora: string;
}
