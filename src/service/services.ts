import type { AxiosResponse } from "axios";
import { api } from "./api";

const ROUTE_PATH = '/info-entrega'

const getInfoEntrega = async (): Promise<AxiosResponse<deliveryDTO[]>> => {
  return await api.get<deliveryDTO[]>(ROUTE_PATH);
}

export { getInfoEntrega };