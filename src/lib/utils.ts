import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Tipos de movimento disponíveis
type TipoMovimento =
  | "entrega"
  | "coleta"
  | "despacho"
  | "retirada"
  | "transferencia";

// Mapeamento dos tipos do GenericListCard para os tipos internos
const TIPO_MOVIMENTO_MAP = {
  delivery: "entrega",
  coleta: "coleta",
  dispatch: "despacho",
  withdrawal: "retirada",
  transfer: "transferencia",
} as const;

// Função para converter tipo do GenericListCard para tipo interno
export function converterTipoMovimento(
  tipoConfig: keyof typeof TIPO_MOVIMENTO_MAP,
): TipoMovimento {
  return TIPO_MOVIMENTO_MAP[tipoConfig];
}

// Função para determinar o tipo de movimento baseado no item
export function getTipoMovimento(item: any): TipoMovimento {
  // Verifica se o item tem propriedades específicas para determinar o tipo
  if (item.hasOwnProperty("documento") && item.hasOwnProperty("frete")) {
    return "entrega";
  }
  if (item.hasOwnProperty("coleta")) {
    return "coleta";
  }
  if (item.hasOwnProperty("minutaDespacho")) {
    return "despacho";
  }
  if (item.hasOwnProperty("retirada")) {
    return "retirada";
  }
  if (item.hasOwnProperty("transferencia")) {
    return "transferencia";
  }

  // Fallback - tenta inferir pelo tipo de dados
  console.warn("Tipo de movimento não identificado para o item:", item);
  return "entrega"; // Fallback padrão
}

// Função principal para controlar a exibição do botão "LANÇAR OCORRÊNCIA"
export function controlarBotaoOcorrencia(
  tipoMovimento: TipoMovimento,
  tipoAcao: number | null | undefined,
): boolean {
  // Validação básica
  if (tipoAcao === null || tipoAcao === undefined) {
    console.warn(`tipo_acao é null/undefined para ${tipoMovimento}`);
    return false; // Por segurança, não mostra o botão
  }

  // Converte para número se necessário
  const tipoAcaoNum = Number(tipoAcao);

  // Aplica as regras específicas para cada tipo de movimento (conforme PHP)
  switch (tipoMovimento) {
    case "entrega":
      // ENTREGA: Permite ocorrência para valores 1, 4, 6 (conforme motorista_entrega.php)
      // 1 = Em Aberto, 4 = Em Trânsito, 6 = Pendente
      return [1, 4, 6, 18].includes(tipoAcaoNum);

    case "coleta":
      // COLETA: Permite ocorrência para valores 1, 4, 6 (conforme motorista_coleta.php)
      // 1 = Em Aberto, 4 = Em Trânsito, 6 = Pendente
      return [1, 2, 4, 6].includes(tipoAcaoNum);

    case "despacho":
      // DESPACHO: Permite ocorrência para valores 1, 4 (conforme motorista_despacho.php)
      // 1 = Em Aberto, 4 = Em Trânsito
      return [1, 4].includes(tipoAcaoNum);

    case "retirada":
      // RETIRADA: Permite ocorrência para todos exceto 8 (conforme motorista_retira.php)
      // 8 = Cancelada
      return tipoAcaoNum !== 8;

    case "transferencia":
      // TRANSFERÊNCIA: Permite ocorrência para todos exceto 8 (conforme motorista_transferencia.php)
      // 8 = Cancelada
      return tipoAcaoNum !== 8;

    default:
      console.warn(`Tipo de movimento não reconhecido: ${tipoMovimento}`);
      return false; // Por segurança, não mostra o botão
  }
}

// Função auxiliar para debug - retorna informações sobre a decisão
export function debugControleBotaoOcorrencia(
  tipoMovimento: TipoMovimento,
  tipoAcao: number | null | undefined,
): {
  podeLancar: boolean;
  motivo: string;
  tipoMovimento: TipoMovimento;
  tipoAcao: number | null | undefined;
} {
  const podeLancar = controlarBotaoOcorrencia(tipoMovimento, tipoAcao);

  let motivo = "";
  if (tipoAcao === null || tipoAcao === undefined) {
    motivo = "tipo_acao é null/undefined";
  } else {
    const tipoAcaoNum = Number(tipoAcao);
    switch (tipoMovimento) {
      case "entrega":
        motivo = [1, 4, 6].includes(tipoAcaoNum)
          ? `Entrega permite ocorrência para tipo_acao ${tipoAcaoNum}`
          : `Entrega não permite ocorrência para tipo_acao ${tipoAcaoNum}`;
        break;
      case "coleta":
        motivo = [1, 4, 6].includes(tipoAcaoNum)
          ? `Coleta permite ocorrência para tipo_acao ${tipoAcaoNum}`
          : `Coleta não permite ocorrência para tipo_acao ${tipoAcaoNum}`;
        break;
      case "despacho":
        motivo = [1, 4].includes(tipoAcaoNum)
          ? `Despacho permite ocorrência para tipo_acao ${tipoAcaoNum}`
          : `Despacho não permite ocorrência para tipo_acao ${tipoAcaoNum}`;
        break;
      case "retirada":
        motivo =
          tipoAcaoNum === 8
            ? "Retirada cancelada"
            : `Retirada permite ocorrência para tipo_acao ${tipoAcaoNum}`;
        break;
      case "transferencia":
        motivo =
          tipoAcaoNum === 8
            ? "Transferência cancelada"
            : `Transferência permite ocorrência para tipo_acao ${tipoAcaoNum}`;
        break;
      default:
        motivo = `Tipo de movimento não reconhecido: ${tipoMovimento}`;
    }
  }

  return {
    podeLancar,
    motivo,
    tipoMovimento,
    tipoAcao,
  };
}
