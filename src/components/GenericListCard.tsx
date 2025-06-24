import { Button } from "@components/Button";
import { H4, P } from "@components/Typography";
import { FlatList, View } from "react-native";
import React from "react";
import { Check } from "lucide-react-native";

// Usando os tipos existentes do projeto
type ColetaItem = coletaDTO;
type DeliveryItem = deliveryDTO;
type WithdrawalItem = retiradaDTO;
type TransferItem = transferenciaDTO;
type DispatchItem = despachoDTO;

type DataItem =
  | ColetaItem
  | DeliveryItem
  | WithdrawalItem
  | TransferItem
  | DispatchItem;

// Configuração de campos para cada tipo
type FieldConfig = {
  label: string;
  key: string;
  isBold?: boolean;
};

type GenericListCardConfig = {
  type: "coleta" | "delivery" | "withdrawal" | "transfer" | "dispatch";
  title: string;
  fields: FieldConfig[];
  idKey: string;
  keyExtractor: (item: DataItem, index: number) => string;
};

interface GenericListCardProps {
  data: DataItem[];
  config: GenericListCardConfig;
  refreshing: boolean;
  onRefresh: () => void;
  selectedItems: string[];
  setSelectedItems: (items: string[]) => void;
  onOpenDetails: (item: DataItem) => void;
  onLancarOcorrencia: (item: DataItem) => void;
}

export function GenericListCard({
  data,
  config,
  refreshing,
  onRefresh,
  selectedItems,
  setSelectedItems,
  onOpenDetails,
  onLancarOcorrencia,
}: GenericListCardProps) {
  const getItemId = (item: DataItem): string => {
    switch (config.type) {
      case "coleta":
        return String((item as ColetaItem).coleta);
      case "delivery":
        return (
          String((item as DeliveryItem).documento) +
          "-" +
          (item as DeliveryItem).frete
        );
      case "withdrawal":
        return (
          String((item as WithdrawalItem).retirada) +
          "-" +
          (item as WithdrawalItem).frete
        );
      case "transfer":
        return (
          String((item as TransferItem).transferencia) +
          "-" +
          (item as TransferItem).frete
        );
      case "dispatch":
        return (
          String((item as DispatchItem).minutaDespacho) +
          "-" +
          (item as DispatchItem).frete
        );
      default:
        return String((item as any).frete || "");
    }
  };

  const getFieldValue = (item: DataItem, field: FieldConfig): string => {
    const value = (item as any)[field.key];
    return value !== undefined && value !== null ? String(value) : "";
  };

  return (
    <FlatList
      data={data}
      keyExtractor={config.keyExtractor}
      showsVerticalScrollIndicator={false}
      refreshing={refreshing}
      onRefresh={onRefresh}
      ListEmptyComponent={() => (
        <View className="flex-1 items-center justify-center">
          <H4 className="mt-10">Sem dados no momento...</H4>
        </View>
      )}
      renderItem={({ item }) => {
        const id = getItemId(item);
        return (
          <View className="mt-3">
            <View className="rounded-lg border border-zinc-600 p-5">
              <View className="w-1/1 mb-5 flex-row items-center justify-center gap-5 self-center rounded-lg bg-blue-900 p-3">
                <Button
                  className="h-8 w-8 flex-1 flex-row items-center bg-transparent"
                  style={{ backgroundColor: "transparent", elevation: 0 }}
                  variant="default"
                  onPress={() => {
                    setSelectedItems(
                      selectedItems.includes(id)
                        ? selectedItems.filter((itemId) => itemId !== id)
                        : [...selectedItems, id],
                    );
                  }}
                >
                  {selectedItems.includes(id) ? (
                    <>
                      <P className="text-base font-bold text-white">
                        Selecionado
                      </P>
                      <View className="ml-8 h-6 w-8 items-center justify-center rounded-full border border-zinc-300 bg-white">
                        <Check size={16} color="#2563eb" />
                      </View>
                    </>
                  ) : (
                    <>
                      <P className="text-base font-bold text-white">
                        Selecionar
                      </P>
                      <View className="ml-8 h-6 w-8 items-center justify-center rounded-full border border-zinc-300 bg-white" />
                    </>
                  )}
                </Button>
              </View>

              <View className="flex-col">
                {config.fields.map((field, index) => (
                  <View key={index} className="flex-row items-center gap-3">
                    <P className={`text-sm ${field.isBold ? "font-bold" : ""}`}>
                      {field.label} - {getFieldValue(item, field)}
                    </P>
                  </View>
                ))}
              </View>

              <View className="mt-5 items-center justify-center">
                <Button
                  size="icon"
                  className="w-1/3"
                  onPress={() => onOpenDetails(item)}
                >
                  <P className="text-base font-bold text-white">Detalhes</P>
                </Button>
              </View>

              <View className="mt-2 items-center justify-center">
                <Button
                  className="w-1/2"
                  style={{ backgroundColor: "#dc2626" }}
                  onPress={() => onLancarOcorrencia(item)}
                >
                  <P className="text-base font-bold text-white">
                    Lançar ocorrência
                  </P>
                </Button>
              </View>
            </View>
          </View>
        );
      }}
    />
  );
}

// Configurações pré-definidas para cada tipo
export const GenericListCardConfigs = {
  coleta: {
    type: "coleta" as const,
    title: "Relação de Coleta",
    fields: [
      { label: "Coleta", key: "coleta", isBold: true },
      { label: "Total Documento", key: "totalDocumento", isBold: true },
      { label: "Volume", key: "volume" },
      { label: "Peso", key: "peso" },
      { label: "Local", key: "destinatario" },
      { label: "Cidade", key: "cidade" },
      { label: "UF", key: "uf" },
      { label: "Status", key: "status", isBold: true },
    ],
    idKey: "coleta",
    keyExtractor: (item: DataItem, index: number) =>
      String((item as ColetaItem).coleta + "srp" + index),
  },

  delivery: {
    type: "delivery" as const,
    title: "Relação de Entrega",
    fields: [
      { label: "Documento", key: "documento", isBold: true },
      { label: "Frete", key: "frete", isBold: true },
      { label: "CTE", key: "cte" },
      { label: "Destino", key: "destinatario" },
      { label: "Cidade", key: "cidade" },
      { label: "UF", key: "uf" },
      { label: "Status", key: "status", isBold: true },
      { label: "Ocorrência", key: "ocorrencia" },
    ],
    idKey: "documento-frete",
    keyExtractor: (item: DataItem, index: number) =>
      String((item as DeliveryItem).documento) +
      "-" +
      (item as DeliveryItem).frete,
  },

  withdrawal: {
    type: "withdrawal" as const,
    title: "Relação de Retirada",
    fields: [
      { label: "Frete", key: "frete", isBold: true },
      { label: "Retirada", key: "retirada", isBold: true },
      { label: "CTE", key: "cte" },
      { label: "Destino", key: "destino" },
      { label: "Cidade", key: "cidade" },
      { label: "UF", key: "uf" },
      { label: "Status", key: "status", isBold: true },
    ],
    idKey: "retirada-frete",
    keyExtractor: (item: DataItem, index: number) =>
      String((item as WithdrawalItem).retirada + "srp" + index),
  },

  transfer: {
    type: "transfer" as const,
    title: "Relação de Transferência",
    fields: [
      { label: "Frete", key: "frete", isBold: true },
      { label: "Transferência", key: "transferencia", isBold: true },
      { label: "CTE", key: "cte", isBold: true },
      { label: "Destino", key: "destino" },
      { label: "Cidade", key: "cidade" },
      { label: "UF", key: "uf" },
      { label: "Status", key: "status", isBold: true },
    ],
    idKey: "transferencia-frete",
    keyExtractor: (item: DataItem, index: number) =>
      String((item as TransferItem).transferencia + "srp" + index),
  },

  dispatch: {
    type: "dispatch" as const,
    title: "Relação de Despacho",
    fields: [
      { label: "Frete", key: "frete", isBold: true },
      { label: "Minuta", key: "minutaDespacho", isBold: true },
      { label: "CTE", key: "CTE" },
      { label: "Destino", key: "destino" },
      { label: "Cidade", key: "cidade" },
      { label: "UF", key: "uf" },
      { label: "Status", key: "status", isBold: true },
    ],
    idKey: "minutaDespacho-frete",
    keyExtractor: (item: DataItem, index: number) =>
      String((item as DispatchItem).frete + "srp" + index),
  },
};
