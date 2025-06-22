import { Button } from "@components/Button";
import { ContainerAppCpX } from "@components/ContainerAppCpX";
import { H1, H4, P } from "@components/Typography";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { getInfoTransferencia } from "@/service/services";
import { CustomModal } from "@/components/CustomModal";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import MaskInput from "react-native-mask-input";
import { useRoute, RouteProp } from "@react-navigation/native";
import { Check } from "lucide-react-native";

type TransferScreenParams = {
  manifestoId: string;
};

type TransferScreenRouteProp = RouteProp<
  { params: TransferScreenParams },
  "params"
>;

export function TransferScreen() {
  const route = useRoute<TransferScreenRouteProp>();
  const manifestoId = route.params?.manifestoId;
  const [entregas, setEntregas] = useState<transferenciaDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<transferenciaDTO | null>(
    null,
  );

  // Estados para o lançamento de ocorrência
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [selectedOcorrencia, setSelectedOcorrencia] = useState("");
  const [isOcorrenciaSheetOpen, setIsOcorrenciaSheetOpen] = useState(false);
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [observacao, setObservacao] = useState("");
  const [minutaNumero, setMinutaNumero] = useState("");

  const ocorrencias = [
    "Transferência cancelada",
    "Filial",
    "Transferência realizada normalmente",
  ];

  const [selectedDocumentos, setSelectedDocumentos] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  // Para ocorrência em lote
  const [loteTransferencias, setLoteTransferencias] = useState<string[]>([]);
  const [loteFretes, setLoteFretes] = useState<string[]>([]);
  const [isLote, setIsLote] = useState(false);

  const fetchData = async () => {
    if (!manifestoId) {
      console.error("ManifestoId is required");
      return;
    }

    setLoading(true);
    try {
      const response = await getInfoTransferencia(manifestoId);
      setEntregas(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    if (!manifestoId) {
      console.error("ManifestoId is required");
      return;
    }

    setRefreshing(true);
    try {
      const response = await getInfoTransferencia(manifestoId);
      setEntregas(response.data);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleLancarOcorrencia = (item: transferenciaDTO) => {
    setMinutaNumero(item.transferencia.toString());
    setIsBottomSheetOpen(true);
    bottomSheetRef.current?.expand();
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedDocumentos([]);
      setSelectAll(false);
    } else {
      const allIds = entregas.map(
        (item) => String(item.transferencia) + "-" + item.frete,
      );
      setSelectedDocumentos(allIds);
      setSelectAll(true);
    }
  };

  const handleLancarOcorrenciaLote = () => {
    if (selectedDocumentos.length === 0) {
      alert(
        "Selecione pelo menos uma transferência para lançar ocorrência em lote.",
      );
      return;
    }
    // Coletar todas as transferências e fretes selecionados
    const transferencias: string[] = [];
    const fretes: string[] = [];
    selectedDocumentos.forEach((id) => {
      const item = entregas.find(
        (item) => String(item.transferencia) + "-" + item.frete === id,
      );
      if (item) {
        transferencias.push(String(item.transferencia));
        fretes.push(String(item.frete));
      }
    });
    setLoteTransferencias(transferencias);
    setLoteFretes(fretes);
    setIsLote(true);
    setIsBottomSheetOpen(true);
    bottomSheetRef.current?.expand();
  };

  const handleSalvarOcorrencia = async () => {
    try {
      if (!selectedOcorrencia || !data || !hora) {
        alert("Por favor, preencha todos os campos obrigatórios");
        return;
      }
      if (isLote && loteTransferencias.length > 0) {
        // TODO: Implementar updateOcorrenciaTransferencia para cada transferência
        for (let i = 0; i < loteTransferencias.length; i++) {
          // await updateOcorrenciaTransferencia(Number(loteTransferencias[i]), {
          //   data_ocorrencia: data,
          //   hora_ocorrencia: hora,
          //   observacao: observacao,
          //   ocorrencia: selectedOcorrencia,
          // });
        }
      } else {
        // await updateOcorrenciaTransferencia(Number(minutaNumero), {
        //   data_ocorrencia: data,
        //   hora_ocorrencia: hora,
        //   observacao: observacao,
        //   ocorrencia: selectedOcorrencia,
        // });
      }
      await fetchData();
      bottomSheetRef.current?.close();
      setIsBottomSheetOpen(false);
      setMinutaNumero("");
      setData("");
      setHora("");
      setObservacao("");
      setSelectedOcorrencia("");
      setIsLote(false);
      setLoteTransferencias([]);
      setLoteFretes([]);
      alert("Ocorrência salva com sucesso!");
    } catch (error) {
      console.error("Error saving ocorrencia:", error);
      alert("Erro ao salvar ocorrência. Por favor, tente novamente.");
    }
  };

  useEffect(() => {
    fetchData();
  }, [manifestoId]);

  if (loading) {
    return (
      <ContainerAppCpX>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </ContainerAppCpX>
    );
  }

  return (
    <ContainerAppCpX>
      <View className="flex-1 p-7">
        <H4>Relação de Transferência</H4>

        {/* Botão de ocorrência em lote */}
        <Button
          className={`mb-2 mt-6 w-full flex-row items-center ${selectedDocumentos.length > 0 ? "bg-blue-900" : ""}`}
          style={
            selectedDocumentos.length === 0
              ? { backgroundColor: "#a5a5d6" }
              : undefined
          }
          onPress={handleLancarOcorrenciaLote}
          disabled={selectedDocumentos.length === 0}
        >
          <P className="font-bold text-white">GERAR OCORRÊNCIA EM LOTE</P>
        </Button>

        {/* Botão de marcar todos */}
        <View className="mb-4 flex-row items-center">
          <Button
            className="flex-1 flex-row items-center bg-blue-900"
            onPress={handleSelectAll}
          >
            {selectAll ? (
              <>
                <P className="text-base font-bold text-white">Selecionado(s)</P>
                <View className="ml-8 h-6 w-8 items-center justify-center rounded-full border border-zinc-300 bg-white">
                  <Check size={16} color="#2563eb" />
                </View>
              </>
            ) : (
              <>
                <P className="text-base font-bold text-white">
                  Selecionar Todos
                </P>
                <View className="ml-8 h-6 w-8 items-center justify-center rounded-full border border-zinc-300 bg-white" />
              </>
            )}
          </Button>
        </View>

        <FlatList
          data={entregas}
          keyExtractor={(item, index) =>
            String(item.transferencia + "srp" + index)
          }
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListEmptyComponent={() => (
            <View className="flex-1 items-center justify-center">
              <H4 className="mt-10">Sem dados no momento...</H4>
            </View>
          )}
          renderItem={({ item }) => {
            const id = String(item.transferencia) + "-" + item.frete;
            return (
              <View className="mt-5">
                <View className="rounded-lg border border-zinc-600 p-5">
                  <View className="w-1/1 mb-5 flex-row items-center justify-center gap-5 self-center rounded-lg bg-blue-900 p-3">
                    <Button
                      className="h-8 w-8 flex-1 flex-row items-center bg-transparent"
                      style={{ backgroundColor: "transparent", elevation: 0 }}
                      variant="default"
                      onPress={() => {
                        setSelectedDocumentos((prev) =>
                          prev.includes(id)
                            ? prev.filter((doc) => doc !== id)
                            : [...prev, id],
                        );
                      }}
                    >
                      {selectedDocumentos.includes(id) ? (
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
                    <View className="flex-row items-center gap-3">
                      <P className="text-sm font-bold">Frete - {item.frete}</P>
                    </View>

                    <View className="flex-row items-center gap-3">
                      <P className="text-sm font-bold">
                        Transferência - {item.transferencia}
                      </P>
                    </View>

                    <View className="flex-row items-center gap-3">
                      <P className="text-sm font-bold">CTE - {item.cte}</P>
                    </View>

                    <View className="flex-row items-center gap-3">
                      <P className="text-sm">Destino - {item.destino}</P>
                    </View>

                    <View className="flex-row items-center gap-3">
                      <P className="text-sm">Cidade - {item.cidade}</P>
                    </View>

                    <View className="flex-row items-center gap-3">
                      <P className="text-sm">UF - {item.uf}</P>
                    </View>

                    <View className="flex-row items-center gap-3">
                      <P className="text-sm font-bold">
                        Status - {item.status}
                      </P>
                    </View>
                  </View>

                  <View className="mt-8 items-center justify-center">
                    <Button
                      onPress={() => {
                        setSelectedItem(item);
                        setModalVisible(true);
                      }}
                      className="w-1/3"
                      size="icon"
                    >
                      <P className="text-base font-bold text-white">Detalhes</P>
                    </Button>
                  </View>

                  <View className="mt-3 items-center justify-center">
                    <Button
                      className="w-1/2"
                      style={{ backgroundColor: "#dc2626" }}
                      onPress={() => handleLancarOcorrencia(item)}
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

        <CustomModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        >
          {selectedItem && (
            <View>
              <H1 className="text-white">
                Transferência: {selectedItem.transferencia}
              </H1>
              <P className="text-white">CTE: {selectedItem.cte}</P>
              <P className="text-white">Destino: {selectedItem.destino}</P>
              <P className="text-white">Cidade: {selectedItem.cidade}</P>
              <P className="text-white">UF: {selectedItem.uf}</P>
              <P className="text-white">Status: {selectedItem.status}</P>
            </View>
          )}
        </CustomModal>

        {isBottomSheetOpen && (
          <BottomSheet
            ref={bottomSheetRef}
            snapPoints={["25%", "50%", "90%"]}
            enablePanDownToClose={true}
            onClose={() => {
              setIsBottomSheetOpen(false);
              setIsLote(false);
              setLoteTransferencias([]);
              setLoteFretes([]);
            }}
          >
            <BottomSheetView className="flex-1 p-4">
              <ScrollView showsVerticalScrollIndicator={false}>
                <H4 className="mb-4">Lançar Ocorrência</H4>
                {isLote && loteTransferencias.length > 0 && (
                  <View className="mb-4">
                    <P className="mb-2 font-bold text-blue-900">
                      Ocorrência em lote para as Transferências/Fretes:
                    </P>
                    <P className="text-xs text-blue-900">
                      {loteTransferencias.map(
                        (trans, idx) =>
                          ` Transferência: ${trans} - Frete: ${loteFretes[idx]} | `,
                      )}
                    </P>
                  </View>
                )}
                <View className="mb-4">
                  <P className="mb-2">Transferência:</P>
                  <TextInput
                    className="h-12 rounded-lg border border-gray-300 px-4"
                    value={
                      isLote ? loteTransferencias.join(", ") : minutaNumero
                    }
                    editable={false}
                  />
                </View>
                <View className="mb-4">
                  <P className="mb-2">Frete:</P>
                  <TextInput
                    className="h-12 rounded-lg border border-gray-300 px-4"
                    value={isLote ? loteFretes.join(", ") : ""}
                    editable={false}
                  />
                </View>
                <View className="mb-4">
                  <P className="mb-2">Ocorrência:</P>
                  <Pressable
                    className="h-12 justify-center rounded-lg border border-gray-300 px-4"
                    onPress={() => setIsOcorrenciaSheetOpen(true)}
                  >
                    <P>{selectedOcorrencia || "Selecione uma ocorrência"}</P>
                  </Pressable>
                </View>

                <View className="mb-4">
                  <P className="mb-2">Data Ocorrência:</P>
                  <MaskInput
                    className="h-12 rounded-lg border border-gray-300 px-4"
                    value={data}
                    onChangeText={setData}
                    mask={[
                      /\d/,
                      /\d/,
                      "/",
                      /\d/,
                      /\d/,
                      "/",
                      /\d/,
                      /\d/,
                      /\d/,
                      /\d/,
                    ]}
                    placeholder="DD/MM/AAAA"
                  />
                </View>

                <View className="mb-4">
                  <P className="mb-2">Hora Ocorrência:</P>
                  <MaskInput
                    className="h-12 rounded-lg border border-gray-300 px-4"
                    value={hora}
                    onChangeText={setHora}
                    mask={[/[0-2]/, /[0-9]/, ":", /[0-5]/, /[0-9]/]}
                    placeholder="HH:MM"
                  />
                </View>

                <View className="mb-4">
                  <P className="mb-2">Observação:</P>
                  <TextInput
                    className="h-24 rounded-lg border border-gray-300 px-4 py-2"
                    value={observacao}
                    onChangeText={setObservacao}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>

                <View className="flex-row justify-between gap-4">
                  <Button
                    className="flex-1"
                    variant="secondary"
                    onPress={() => {
                      bottomSheetRef.current?.close();
                      setIsBottomSheetOpen(false);
                    }}
                  >
                    <P className="text-white">Voltar</P>
                  </Button>
                  <Button className="flex-1" onPress={handleSalvarOcorrencia}>
                    <P className="text-white">Salvar</P>
                  </Button>
                </View>
              </ScrollView>
            </BottomSheetView>
          </BottomSheet>
        )}

        {isOcorrenciaSheetOpen && (
          <BottomSheet
            snapPoints={["50%"]}
            enablePanDownToClose={true}
            onClose={() => setIsOcorrenciaSheetOpen(false)}
          >
            <BottomSheetView className="flex-1 p-4">
              <H4 className="mb-4">Selecione a Ocorrência</H4>

              <View className="flex-1">
                {ocorrencias.map((ocorrencia, index) => (
                  <Pressable
                    key={index}
                    className="border-b border-gray-200 py-4"
                    onPress={() => {
                      setSelectedOcorrencia(ocorrencia);
                      setIsOcorrenciaSheetOpen(false);
                    }}
                  >
                    <P>{ocorrencia}</P>
                  </Pressable>
                ))}
              </View>
            </BottomSheetView>
          </BottomSheet>
        )}
      </View>
    </ContainerAppCpX>
  );
}
