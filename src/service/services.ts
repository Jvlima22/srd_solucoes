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
const ROUTE_PATH_MANIFEST = "/manifesto";

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

const getInfoEntrega = async (): Promise<AxiosResponse<deliveryDTO[]>> => {
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

  return await api.get<deliveryDTO[]>(ROUTE_PATH_ENTREGA);
};

const getInfoColeta = async (): Promise<AxiosResponse<coletaDTO[]>> => {
  if (DEV) {
    console.log("Mocking API response");
    const response = {
      data: coletaJSON,
      status: 200,
      statusText: "OK",
    };
    await new Promise((resolve) => setTimeout(resolve, timeout));
    return response as AxiosResponse<coletaDTO[]>;
  }

  return await api.get<coletaDTO[]>(ROUTE_PATH_COLETA);
};

const getInfoDespacho = async (): Promise<AxiosResponse<despachoDTO[]>> => {
  if (DEV) {
    console.log("Mocking API response");
    const response = {
      data: despachoJSON,
      status: 200,
      statusText: "OK",
    };
    await new Promise((resolve) => setTimeout(resolve, timeout));
    return response as AxiosResponse<despachoDTO[]>;
  }

  return await api.get<despachoDTO[]>(ROUTE_PATH_DESPACHO);
};

const getInfoRetirada = async (): Promise<AxiosResponse<retiradaDTO[]>> => {
  if (DEV) {
    console.log("Mocking API response");
    const response = {
      data: retiradaJSON,
      status: 200,
      statusText: "OK",
    };
    await new Promise((resolve) => setTimeout(resolve, timeout));
    return response as AxiosResponse<retiradaDTO[]>;
  }

  return await api.get<retiradaDTO[]>(ROUTE_PATH_RETIRADA);
};

const getInfoTransferencia = async (): Promise<
  AxiosResponse<transferenciaDTO[]>
> => {
  if (DEV) {
    console.log("Mocking API response");
    const response = {
      data: transferenciaJSON,
      status: 200,
      statusText: "OK",
    };
    await new Promise((resolve) => setTimeout(resolve, timeout));
    return response as AxiosResponse<transferenciaDTO[]>;
  }

  return await api.get<transferenciaDTO[]>(ROUTE_PATH_TRANSFERENCIA);
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

export {
  auth_login,
  getInfoEntrega,
  getInfoColeta,
  getInfoDespacho,
  getInfoRetirada,
  getInfoTransferencia,
  getInfoManifest,
};
