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
const ROUTE_PATH_ENTREGA = "/info-entrega";
const ROUTE_PATH_COLETA = "/info-coleta";
const ROUTE_PATH_DESPACHO = "/info-despacho";
const ROUTE_PATH_RETIRADA = "/info-retirada";
const ROUTE_PATH_TRANSFERENCIA = "/info-transferencia";
const ROUTE_PATH_MANIFEST = "/manifestos";
const ROUTE_PATH_OCORRENCIA_ENTREGA = "/ocorrencia/entrega";
const ROUTE_PATH_OCORRENCIA_COLETA = "/ocorrencia/coleta";

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
    unidade,
    login,
    senha,
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

const getInfoManifest = async (): Promise<AxiosResponse<manifestDTO[]>> => {
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

  return await api.get<manifestDTO[]>(ROUTE_PATH_MANIFEST);
};

const updateOcorrenciaEntrega = async (
  documentoId: number,
  data: {
    data_ocorrencia: string;
    hora_ocorrencia: string;
    observacao: string;
    ocorrencia: string;
  },
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

  return await api.put(`${ROUTE_PATH_OCORRENCIA_ENTREGA}/${documentoId}`, data);
};

const updateOcorrenciaColeta = async (
  coletaNumero: number,
  data: {
    data_ocorrencia: string;
    hora_ocorrencia: string;
    observacao: string;
    ocorrencia: string;
  },
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

  return await api.put(`${ROUTE_PATH_OCORRENCIA_COLETA}/${coletaNumero}`, data);
};

const updateOcorrenciaRetirada = async (
  retiradaId: number,
  data: {
    data_ocorrencia: string;
    hora_ocorrencia: string;
    observacao: string;
    ocorrencia: string;
  },
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

  return await api.put(`/ocorrencia/retirada/${retiradaId}`, data);
};

const updateOcorrenciaTransferencia = async (
  transferenciaId: number,
  data: {
    data_ocorrencia: string;
    hora_ocorrencia: string;
    observacao: string;
    ocorrencia: string;
  },
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

  return await api.put(`/ocorrencia/transferencia/${transferenciaId}`, data);
};

export async function updateOcorrenciaDespacho(minutaId: number, payload: any) {
  try {
    const response = await api.put(`/ocorrencia/despacho/${minutaId}`, payload);
    return response;
  } catch (error) {
    throw error;
  }
}

export const getDetalhesEntrega = async (freteId: string) => {
  try {
    const response = await api.get(`/detalhes/entrega/${freteId}`);
    return response;
  } catch (error) {
    console.error("Erro ao buscar detalhes da entrega:", error);
    throw error;
  }
};

export const getDetalhesColeta = async (coletaId: string) => {
  try {
    const response = await api.get(`/detalhes/coleta/${coletaId}`);
    return response;
  } catch (error) {
    console.error("Erro ao buscar detalhes da coleta:", error);
    throw error;
  }
};

export const getDetalhesRetirada = async (retiradaId: string) => {
  try {
    const response = await api.get(`/detalhes/retirada/${retiradaId}`);
    return response;
  } catch (error) {
    console.error("Erro ao buscar detalhes da retirada:", error);
    throw error;
  }
};

export const getDetalhesTransferencia = async (transferenciaId: string) => {
  try {
    const response = await api.get(
      `/detalhes/transferencia/${transferenciaId}`,
    );
    return response;
  } catch (error) {
    console.error("Erro ao buscar detalhes da transferência:", error);
    throw error;
  }
};

export const getDetalhesDespacho = async (despachoId: string) => {
  try {
    const response = await api.get(`/detalhes/despacho/${despachoId}`);
    return response;
  } catch (error) {
    console.error("Erro ao buscar detalhes do despacho:", error);
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
};
