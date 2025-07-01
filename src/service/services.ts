import type { AxiosResponse } from "axios";
import { api } from "./api";
import entregaJSON from "@/__MOCK__/entrega_mock.json";
import coletaJSON from "@/__MOCK__/coleta_mock.json";
import despachoJSON from "@/__MOCK__/despacho_mock.json";
import retiradaJSON from "@/__MOCK__/retirada_mock.json";
import transferenciaJSON from "@/__MOCK__/transferencia_mock.json";
import manifestJSON from "@/__MOCK__/manifest_mock.json";

const DEV = false;
const timeout = 900;

const ROUTE_PATH_AUTH = "/login";
const ROUTE_PATH_UNIDADES = "/unidades";
const ROUTE_PATH_ENTREGA = "/info-entrega";
const ROUTE_PATH_COLETA = "/info-coleta";
const ROUTE_PATH_DESPACHO = "/info-despacho";
const ROUTE_PATH_RETIRADA = "/info-retirada";
const ROUTE_PATH_TRANSFERENCIA = "/info-transferencia";
const ROUTE_PATH_MANIFEST = "/motoristas/manifestos";
const ROUTE_PATH_TRANSPORTE_INICIAR = "/transporte/iniciar";
const ROUTE_PATH_OCORRENCIA_ENTREGA = "/ocorrencia/entrega";
const ROUTE_PATH_OCORRENCIA_COLETA = "/ocorrencia/coleta";
const ROUTE_PATH_OCORRENCIA_RETIRADA = "/ocorrencia/retirada";
const ROUTE_PATH_OCORRENCIA_TRANSFERENCIA = "/ocorrencia/transferencia";
const ROUTE_PATH_OCORRENCIA_DESPACHO = "/ocorrencia/despacho";
const ROUTE_PATH_DETALHES_ENTREGA = "/detalhes/entrega";
const ROUTE_PATH_DETALHES_COLETA = "/detalhes/coleta";
const ROUTE_PATH_DETALHES_RETIRADA = "/detalhes/retirada";
const ROUTE_PATH_DETALHES_TRANSFERENCIA = "/detalhes/transferencia";
const ROUTE_PATH_DETALHES_DESPACHO = "/detalhes/despacho";

const auth_login = async (unidade: string, login: string, senha: string) => {
  if (DEV) {
    console.log("Mocking API response");
    const response = {
      data: {
        message: "Login realizado com sucesso",
        usuario: {
          id: 6,
          nome: "Teste",
          login: "TESTE",
          nome_unidade: "AGENTE",
          unidade: "AGENTE",
        },
      },
      status: 200,
      statusText: "OK",
    };
    await new Promise((resolve) => setTimeout(resolve, timeout));

    return response as AxiosResponse<LoginReponse>;
  }

  return await api.post<LoginReponse>(ROUTE_PATH_AUTH, {
    unidade: unidade.toUpperCase(),
    login,
    senha,
  });
};

const getUnidades = async (search?: string) => {
  if (DEV) {
    console.log("Mocking unidades API response");
    const response = {
      data: {
        unidades: [
          { id: 1, nome: "AGENTE", identificador: "AGENTE" },
          { id: 2, nome: "FILIAL SP", identificador: "FILIAL_SP" },
          { id: 3, nome: "FILIAL RJ", identificador: "FILIAL_RJ" },
        ],
      },
      status: 200,
      statusText: "OK",
    };
    await new Promise((resolve) => setTimeout(resolve, timeout));
    return response as AxiosResponse<{ unidades: Unidade[] }>;
  }

  const params = search ? { search } : {};
  return await api.get<{ unidades: Unidade[] }>(ROUTE_PATH_UNIDADES, {
    params,
  });
};

const getInfoEntrega = async (
  manifestoId: string,
): Promise<AxiosResponse<deliveryDTO[]>> => {
  if (DEV) {
    console.log("Mocking API response");
    const response = {
      data: entregaJSON,
      status: 200,
      statusText: "OK",
    };
    await new Promise((resolve) => setTimeout(resolve, timeout));
    return response as AxiosResponse<deliveryDTO[]>;
  }

  console.log("Fetching API response PRODUCTION");

  return await api.get<deliveryDTO[]>(`${ROUTE_PATH_ENTREGA}/${manifestoId}`);
};

const getInfoColeta = async (
  manifestoId: string,
): Promise<AxiosResponse<coletaDTO[]>> => {
  if (DEV) {
    console.log("Mocking API response");
    const response = {
      data: coletaJSON,
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as any,
    };
    await new Promise((resolve) => setTimeout(resolve, timeout));
    return response as AxiosResponse<coletaDTO[]>;
  }

  return await api.get<coletaDTO[]>(`${ROUTE_PATH_COLETA}/${manifestoId}`);
};

const getInfoDespacho = async (
  manifestoId: string,
): Promise<AxiosResponse<despachoDTO[]>> => {
  if (DEV) {
    console.log("Mocking API response");
    const response = {
      data: despachoJSON.map((item) => ({
        ...item,
        frete: item.total_frete,
        minutaDespacho: item.minuta_numero,
        CTE: item.minuta_numero.toString(),
        destino: `${item.local}, ${item.cidade} - ${item.uf}`,
      })),
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as any,
    };
    await new Promise((resolve) => setTimeout(resolve, timeout));
    return response as AxiosResponse<despachoDTO[]>;
  }

  return await api.get<despachoDTO[]>(`${ROUTE_PATH_DESPACHO}/${manifestoId}`);
};

const getInfoRetirada = async (
  manifestoId: string,
): Promise<AxiosResponse<retiradaDTO[]>> => {
  if (DEV) {
    console.log("Mocking API response");
    const response = {
      data: [
        {
          frete: 20,
          retirada: 2,
          cte: "Sem Informação",
          destino: "Agente de entrega teste",
          cidade: "SAO PAULO",
          uf: "SP",
          status: "EM ABERTO",
        },
      ],
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as any,
    };
    await new Promise((resolve) => setTimeout(resolve, timeout));
    return response as AxiosResponse<retiradaDTO[]>;
  }

  return await api.get<retiradaDTO[]>(`${ROUTE_PATH_RETIRADA}/${manifestoId}`);
};

const getInfoTransferencia = async (
  manifestoId: string,
): Promise<AxiosResponse<transferenciaDTO[]>> => {
  if (DEV) {
    console.log("Mocking API response");
    const response = {
      data: transferenciaJSON,
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as any,
    };
    await new Promise((resolve) => setTimeout(resolve, timeout));
    return response as AxiosResponse<transferenciaDTO[]>;
  }

  return await api.get<transferenciaDTO[]>(
    `${ROUTE_PATH_TRANSFERENCIA}/${manifestoId}`,
  );
};

const getInfoManifest = async (
  id_motorista?: number,
): Promise<AxiosResponse<manifestDTO[]>> => {
  if (DEV) {
    console.log("Mocking API response");
    const response = {
      data: manifestJSON,
      status: 200,
      statusText: "OK",
    };
    await new Promise((resolve) => setTimeout(resolve, timeout));
    return response as AxiosResponse<manifestDTO[]>;
  }

  // Usar diretamente a rota /manifestos que retorna todos os manifestos
  const url = "/manifestos";
  console.log("Fetching manifestos with URL:", url);

  try {
    const response = await api.get(url);
    console.log("Raw manifestos response:", response.data);

    // Garantir que a resposta seja um array
    const manifestos = Array.isArray(response.data) ? response.data : [];
    console.log("Processed manifestos:", manifestos);

    return {
      ...response,
      data: manifestos,
    } as AxiosResponse<manifestDTO[]>;
  } catch (error) {
    console.error("Error in getInfoManifest:", error);
    throw error;
  }
};

const iniciarTransporte = async (
  id_manifesto: number,
  id_motorista: number,
  data_saida: string,
  hora_saida: string,
): Promise<AxiosResponse> => {
  if (DEV) {
    console.log("Mocking iniciar transporte");
    const response = {
      data: {
        success: true,
        message: "Transporte iniciado com sucesso.",
        manifesto_id: id_manifesto,
        new_status: 4,
        data_saida: data_saida,
        hora_saida: hora_saida,
      },
      status: 200,
      statusText: "OK",
    };
    await new Promise((resolve) => setTimeout(resolve, timeout));
    return response as AxiosResponse;
  }

  console.log("Iniciando transporte:", {
    id_manifesto,
    id_motorista,
    data_saida,
    hora_saida,
  });

  return await api.post(ROUTE_PATH_TRANSPORTE_INICIAR, {
    id_manifesto,
    id_motorista,
    data_saida,
    hora_saida,
  });
};

// Tipos para as ocorrências baseados no servidor
type OcorrenciaEntregaData = {
  ocorrencia:
    | "Aguardado no local"
    | "Cliente recusou a entrega"
    | "Em transito para entrega"
    | "Entrega cancelada pelo cliente"
    | "Entrega realizado normalmente";
  data_ocorrencia: string;
  hora_ocorrencia: string;
  observacao?: string;
  recebedor?: string;
  documento_recebedor?: string;
  id_tipo_recebedor?: number;
};

type OcorrenciaColetaData = {
  ocorrencia:
    | "Coleta cancelada"
    | "Em transito para coleta"
    | "Coleta realizado normalmente";
  data_ocorrencia: string;
  hora_ocorrencia: string;
  observacao?: string;
  recebedor?: string;
  documento_recebedor?: string;
  id_tipo_recebedor?: number;
};

type OcorrenciaRetiradaData = {
  ocorrencia:
    | "retirada realizada"
    | "retira cancelada"
    | "em transito para retirada";
  data_ocorrencia: string;
  hora_ocorrencia: string;
  observacao?: string;
};

type OcorrenciaTransferenciaData = {
  ocorrencia:
    | "transferencia cancelada"
    | "transferencia realizada"
    | "em transito para unidade de destino";
  data_ocorrencia: string;
  hora_ocorrencia: string;
  observacao?: string;
};

type OcorrenciaDespachoData = {
  ocorrencia:
    | "despacho cancelado"
    | "em transito para despacho"
    | "despacho realizado";
  data_ocorrencia: string;
  hora_ocorrencia: string;
  observacao?: string;
};

const updateOcorrenciaEntrega = async (
  freteId: number,
  data: OcorrenciaEntregaData | FormData,
): Promise<AxiosResponse> => {
  if (DEV) {
    console.log("Mocking API response");
    const response = {
      data: { message: "Ocorrência atualizada com sucesso" },
      status: 200,
      statusText: "OK",
    };
    await new Promise((resolve) => setTimeout(resolve, timeout));
    return response as AxiosResponse;
  }

  if (data instanceof FormData) {
    return await api.put(`${ROUTE_PATH_OCORRENCIA_ENTREGA}/${freteId}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  return await api.put(`${ROUTE_PATH_OCORRENCIA_ENTREGA}/${freteId}`, data);
};

const updateOcorrenciaColeta = async (
  coletaId: number,
  data: OcorrenciaColetaData | FormData,
): Promise<AxiosResponse> => {
  if (DEV) {
    console.log("Mocking API response");
    const response = {
      data: { message: "Ocorrência atualizada com sucesso" },
      status: 200,
      statusText: "OK",
    };
    await new Promise((resolve) => setTimeout(resolve, timeout));
    return response as AxiosResponse;
  }

  if (data instanceof FormData) {
    return await api.put(`${ROUTE_PATH_OCORRENCIA_COLETA}/${coletaId}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  return await api.put(`${ROUTE_PATH_OCORRENCIA_COLETA}/${coletaId}`, data);
};

const updateOcorrenciaRetirada = async (
  retiradaId: number,
  data: OcorrenciaRetiradaData,
): Promise<AxiosResponse> => {
  if (DEV) {
    console.log("Mocking API response");
    const response = {
      data: { message: "Ocorrência atualizada com sucesso" },
      status: 200,
      statusText: "OK",
    };
    await new Promise((resolve) => setTimeout(resolve, timeout));
    return response as AxiosResponse;
  }

  return await api.put(`${ROUTE_PATH_OCORRENCIA_RETIRADA}/${retiradaId}`, data);
};

const updateOcorrenciaTransferencia = async (
  transferenciaId: number,
  freteId: number,
  data: OcorrenciaTransferenciaData,
): Promise<AxiosResponse> => {
  if (DEV) {
    console.log("Mocking API response");
    const response = {
      data: { message: "Ocorrência atualizada com sucesso" },
      status: 200,
      statusText: "OK",
    };
    await new Promise((resolve) => setTimeout(resolve, timeout));
    return response as AxiosResponse;
  }

  return await api.put(
    `${ROUTE_PATH_OCORRENCIA_TRANSFERENCIA}/${transferenciaId}/${freteId}`,
    data,
  );
};

const updateOcorrenciaDespacho = async (
  despachoId: number,
  data: OcorrenciaDespachoData,
): Promise<AxiosResponse> => {
  if (DEV) {
    console.log("Mocking API response");
    const response = {
      data: { message: "Ocorrência atualizada com sucesso" },
      status: 200,
      statusText: "OK",
    };
    await new Promise((resolve) => setTimeout(resolve, timeout));
    return response as AxiosResponse;
  }

  return await api.put(`${ROUTE_PATH_OCORRENCIA_DESPACHO}/${despachoId}`, data);
};

const getDetalhesEntrega = async (freteId: string): Promise<AxiosResponse> => {
  if (DEV) {
    console.log("Mocking API response");
    const response = {
      data: {
        documento: "123456",
        frete: freteId,
        ocorrencias: [
          {
            numero: 1,
            ocorrencia: "Entrega realizado normalmente",
            data: "01/01/2024",
            hora: "10:00",
            excluir: true,
          },
        ],
      },
      status: 200,
      statusText: "OK",
    };
    await new Promise((resolve) => setTimeout(resolve, timeout));
    return response as AxiosResponse;
  }

  try {
    const response = await api.get(`${ROUTE_PATH_DETALHES_ENTREGA}/${freteId}`);
    return response;
  } catch (error) {
    console.error("Erro ao buscar detalhes da entrega:", error);
    throw error;
  }
};

const getDetalhesColeta = async (coletaId: string): Promise<AxiosResponse> => {
  if (DEV) {
    console.log("Mocking API response");
    const response = {
      data: {
        "Numero da coleta": parseInt(coletaId),
        ocorrencias: [
          {
            id: 1,
            documentos: "DOC001, DOC002",
            nome_ocorrencia: "Coleta realizado normalmente",
            data_ocorrencia: "01/01/2024",
            hora_ocorrencia: "10:00",
          },
        ],
      },
      status: 200,
      statusText: "OK",
    };
    await new Promise((resolve) => setTimeout(resolve, timeout));
    return response as AxiosResponse;
  }

  try {
    const response = await api.get(`${ROUTE_PATH_DETALHES_COLETA}/${coletaId}`);
    return response;
  } catch (error) {
    console.error("Erro ao buscar detalhes da coleta:", error);
    throw error;
  }
};

const getDetalhesRetirada = async (
  retiradaId: string,
): Promise<AxiosResponse> => {
  if (DEV) {
    console.log("Mocking API response");
    const response = {
      data: {
        numero_retirada: retiradaId,
        detalhes: [
          {
            freteId: "123",
            numero_retirada: retiradaId,
            documento: "DOC001",
            ocorrencia: "retirada realizada",
            data: "01/01/2024",
            hora: "10:00",
            excluir: true,
          },
        ],
      },
      status: 200,
      statusText: "OK",
    };
    await new Promise((resolve) => setTimeout(resolve, timeout));
    return response as AxiosResponse;
  }

  try {
    const response = await api.get(
      `${ROUTE_PATH_DETALHES_RETIRADA}/${retiradaId}`,
    );
    return response;
  } catch (error) {
    console.error("Erro ao buscar detalhes da retirada:", error);
    throw error;
  }
};

const getDetalhesTransferencia = async (
  transferenciaId: string,
  freteId: string,
): Promise<AxiosResponse> => {
  if (DEV) {
    console.log("Mocking API response");
    const response = {
      data: {
        numero_transferencia: transferenciaId,
        freteId: freteId,
        detalhes: [
          {
            id: 136,
            freteId: freteId,
            numero_transferencia: transferenciaId,
            documento: "DOC001",
            ocorrencia: "transferencia realizada",
            data: "01/01/2024",
            hora: "10:00",
            excluir: true,
          },
        ],
      },
      status: 200,
      statusText: "OK",
    };
    await new Promise((resolve) => setTimeout(resolve, timeout));
    return response as AxiosResponse;
  }

  try {
    const response = await api.get(
      `${ROUTE_PATH_DETALHES_TRANSFERENCIA}/${transferenciaId}/${freteId}`,
    );
    return response;
  } catch (error) {
    console.error("Erro ao buscar detalhes da transferência:", error);
    throw error;
  }
};

const getDetalhesDespacho = async (
  despachoId: string,
): Promise<AxiosResponse> => {
  if (DEV) {
    console.log("Mocking API response");
    const response = {
      data: {
        numero_minuta: 12345,
        frete: Number(despachoId),
        ocorrencias: [
          {
            id: 1,
            documento: "DOC001",
            ocorrencia: "despacho realizado",
            data: "01/01/2024",
            hora: "10:00",
            excluir: true,
          },
          {
            id: 2,
            documento: "DOC002",
            ocorrencia: "em transito para despacho",
            data: "31/12/2023",
            hora: "14:30",
            excluir: true,
          },
        ],
      },
      status: 200,
      statusText: "OK",
    };
    await new Promise((resolve) => setTimeout(resolve, timeout));
    return response as AxiosResponse;
  }

  try {
    const response = await api.get(
      `${ROUTE_PATH_DETALHES_DESPACHO}/${despachoId}`,
    );
    return response;
  } catch (error) {
    console.error("Erro ao buscar detalhes do despacho:", error);
    throw error;
  }
};

// Funções de exclusão para o ícone trash2
const deleteOcorrenciaEntrega = async (
  ocorrenciaId: string,
): Promise<AxiosResponse> => {
  if (DEV) {
    console.log("Mocking API response");
    const response = {
      data: { message: "Detalhe excluído com sucesso!" },
      status: 200,
      statusText: "OK",
    };
    await new Promise((resolve) => setTimeout(resolve, timeout));
    return response as AxiosResponse;
  }

  try {
    const response = await api.delete(
      `${ROUTE_PATH_DETALHES_ENTREGA}/${ocorrenciaId}`,
    );
    return response;
  } catch (error) {
    console.error("Erro ao excluir ocorrência da entrega:", error);
    throw error;
  }
};

const deleteOcorrenciaColeta = async (
  ocorrenciaId: string,
): Promise<AxiosResponse> => {
  if (DEV) {
    console.log("Mocking API response");
    const response = {
      data: { message: "Detalhe excluído com sucesso!" },
      status: 200,
      statusText: "OK",
    };
    await new Promise((resolve) => setTimeout(resolve, timeout));
    return response as AxiosResponse;
  }

  try {
    const response = await api.delete(
      `${ROUTE_PATH_DETALHES_COLETA}/${ocorrenciaId}`,
    );
    return response;
  } catch (error) {
    console.error("Erro ao excluir ocorrência da coleta:", error);
    throw error;
  }
};

const deleteOcorrenciaDespacho = async (
  ocorrenciaId: string,
): Promise<AxiosResponse> => {
  if (DEV) {
    console.log("Mocking API response");
    const response = {
      data: { message: "Detalhe excluído com sucesso!" },
      status: 200,
      statusText: "OK",
    };
    await new Promise((resolve) => setTimeout(resolve, timeout));
    return response as AxiosResponse;
  }

  try {
    const response = await api.delete(
      `${ROUTE_PATH_DETALHES_DESPACHO}/${ocorrenciaId}`,
    );
    return response;
  } catch (error) {
    console.error("Erro ao excluir ocorrência do despacho:", error);
    throw error;
  }
};

const deleteOcorrenciaRetirada = async (
  ocorrenciaId: string,
): Promise<AxiosResponse> => {
  if (DEV) {
    console.log("Mocking API response");
    const response = {
      data: { message: "Detalhe excluído com sucesso!" },
      status: 200,
      statusText: "OK",
    };
    await new Promise((resolve) => setTimeout(resolve, timeout));
    return response as AxiosResponse;
  }

  try {
    const response = await api.delete(
      `${ROUTE_PATH_DETALHES_RETIRADA}/${ocorrenciaId}`,
    );
    return response;
  } catch (error) {
    console.error("Erro ao excluir ocorrência da retirada:", error);
    throw error;
  }
};

const deleteOcorrenciaTransferencia = async (
  ocorrenciaId: string,
): Promise<AxiosResponse> => {
  if (DEV) {
    console.log("Mocking API response");
    const response = {
      data: { message: "Detalhe excluído com sucesso!" },
      status: 200,
      statusText: "OK",
    };
    await new Promise((resolve) => setTimeout(resolve, timeout));
    return response as AxiosResponse;
  }

  try {
    const response = await api.delete(
      `${ROUTE_PATH_DETALHES_TRANSFERENCIA}/${ocorrenciaId}`,
    );
    return response;
  } catch (error) {
    console.error("Erro ao excluir ocorrência da transferência:", error);
    throw error;
  }
};

export {
  auth_login,
  getInfoEntrega,
  getInfoColeta,
  getInfoDespacho,
  getInfoRetirada,
  getInfoTransferencia,
  getInfoManifest,
  updateOcorrenciaEntrega,
  updateOcorrenciaColeta,
  updateOcorrenciaRetirada,
  updateOcorrenciaTransferencia,
  updateOcorrenciaDespacho,
  getDetalhesEntrega,
  getDetalhesColeta,
  getDetalhesRetirada,
  getDetalhesTransferencia,
  getDetalhesDespacho,
  deleteOcorrenciaEntrega,
  deleteOcorrenciaColeta,
  deleteOcorrenciaDespacho,
  deleteOcorrenciaRetirada,
  deleteOcorrenciaTransferencia,
  iniciarTransporte,
  getUnidades,
};
