import { Button } from "@components/Button";
import { ContainerAppCpX } from "@components/ContainerAppCpX";
import { H4, P } from "@components/Typography";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  TouchableOpacity,
  View,
  TextInput,
} from "react-native";
import React, { useEffect, useState, useMemo, useRef } from "react";
import { getInfoEntrega, updateOcorrenciaEntrega } from "@/service/services";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import MaskInput from "react-native-mask-input";
import { useRoute, RouteProp } from "@react-navigation/native";
import { Check } from "lucide-react-native";

type DeliveryScreenParams = {
  manifestoId: string;
};

type DeliveryScreenRouteProp = RouteProp<
  { params: DeliveryScreenParams },
  "params"
>;

export function DeliveryScreen() {
  const route = useRoute<DeliveryScreenRouteProp>();
  const manifestoId = route.params?.manifestoId;
  const [entregas, setEntregas] = useState<deliveryDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<deliveryDTO | null>(null);
  const [ocorrenciaData, setOcorrenciaData] = useState<{
    id: number;
    ocorrencia: string;
    data_ocorrencia: string;
    hora_ocorrencia: string;
    observacao: string;
  } | null>(null);

  // Bottom Sheet
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [documento, setDocumento] = useState("");
  const [frete, setFrete] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [observacao, setObservacao] = useState("");
  const [selectedOcorrencia, setSelectedOcorrencia] = useState("");
  const [isOcorrenciaSheetOpen, setIsOcorrenciaSheetOpen] = useState(false);
  const [selectedDocumentos, setSelectedDocumentos] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Novo estado para lote
  const [loteDocs, setLoteDocs] = useState<string[]>([]);
  const [loteFretes, setLoteFretes] = useState<string[]>([]);
  const [isLote, setIsLote] = useState(false);

  const ocorrencias = [
    "Aguardado no local",
    "Cliente recusou a entrega",
    "Entrega cancelada pelo cliente",
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getInfoEntrega(manifestoId);
      setEntregas(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await getInfoEntrega(manifestoId);
      setEntregas(response.data);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleLancarOcorrencia = async (
    documentoId: number,
    freteId: number,
  ) => {
    setDocumento(documentoId.toString());
    setFrete(freteId.toString());
    setIsBottomSheetOpen(true);
    bottomSheetRef.current?.expand();
  };

  const handleSalvarOcorrencia = async () => {
    try {
      if (!selectedOcorrencia || !data || !hora) {
        alert("Por favor, preencha todos os campos obrigatórios");
        return;
      }
      if (isLote && loteDocs.length > 0) {
        // Lançar ocorrência para todos os documentos/fretes em lote
        for (let i = 0; i < loteDocs.length; i++) {
          await updateOcorrenciaEntrega(Number(loteDocs[i]), {
            data_ocorrencia: data,
            hora_ocorrencia: hora,
            observacao: observacao,
            ocorrencia: selectedOcorrencia,
          });
        }
      } else {
        await updateOcorrenciaEntrega(Number(documento), {
          data_ocorrencia: data,
          hora_ocorrencia: hora,
          observacao: observacao,
          ocorrencia: selectedOcorrencia,
        });
      }
      // Atualiza a lista de entregas
      await fetchData();
      // Fecha o bottom sheet e limpa o formulário
      bottomSheetRef.current?.close();
      setIsBottomSheetOpen(false);
      // Reset form
      setDocumento("");
      setFrete("");
      setData("");
      setHora("");
      setObservacao("");
      setSelectedOcorrencia("");
      setIsLote(false);
      setLoteDocs([]);
      setLoteFretes([]);
      alert("Ocorrência salva com sucesso!");
    } catch (error) {
      console.error("Error saving ocorrencia:", error);
      alert("Erro ao salvar ocorrência. Por favor, tente novamente.");
    }
  };

  // Função para selecionar/desmarcar todos
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedDocumentos([]);
      setSelectAll(false);
    } else {
      const allIds = entregas.map(
        (item) => String(item.documento) + "-" + item.frete,
      );
      setSelectedDocumentos(allIds);
      setSelectAll(true);
    }
  };

  // Função para lançar ocorrência em lote (abrir o menu para todos os selecionados)
  const handleLancarOcorrenciaLote = () => {
    if (selectedDocumentos.length === 0) {
      alert("Selecione pelo menos uma entrega para lançar ocorrência em lote.");
      return;
    }
    // Coletar todos os documentos e fretes selecionados
    const docs: string[] = [];
    const fretes: string[] = [];
    selectedDocumentos.forEach((id) => {
      const item = entregas.find(
        (item) => String(item.documento) + "-" + item.frete === id,
      );
      if (item) {
        docs.push(String(item.documento));
        fretes.push(String(item.frete));
      }
    });
    setLoteDocs(docs);
    setLoteFretes(fretes);
    setIsLote(true);
    setIsBottomSheetOpen(true);
    bottomSheetRef.current?.expand();
  };

  useEffect(() => {
    fetchData();
  }, []);

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
        <H4 className="font-bold">Relação de Entrega</H4>

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
          keyExtractor={(item) => String(item.documento) + "-" + item.frete}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListEmptyComponent={() => (
            <View className="flex-1 items-center justify-center">
              <H4 className="mt-10">Sem dados no momento...</H4>
            </View>
          )}
          renderItem={({ item }) => {
            const id = String(item.documento) + "-" + item.frete;
            return (
              <View className="mt-3">
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
                      <P className="text-sm font-bold">
                        Documento - {item.documento}
                      </P>
                    </View>

                    <View className="flex-row items-center gap-3">
                      <P className="text-sm font-bold">Frete - {item.frete}</P>
                    </View>

                    <View className="flex-row items-center gap-3">
                      <P className="text-sm">CTE - {item.cte}</P>
                    </View>

                    <View className="flex-row items-center gap-3">
                      <P className="text-sm">Destino - {item.destinatario}</P>
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

                    <View className="flex-row items-center gap-3">
                      <P className="text-sm">Ocorrência - {item.ocorrencia}</P>
                    </View>
                  </View>

                  <View className="mt-5 items-center justify-center">
                    <Button
                      size="icon"
                      className="w-1/3"
                      onPress={() => {
                        setSelectedItem(item);
                        setModalVisible(true);
                      }}
                    >
                      <P className="text-base font-bold text-white">Detalhes</P>
                    </Button>
                  </View>

                  <View className="mt-2 items-center justify-center">
                    <Button
                      className="w-1/2"
                      style={{ backgroundColor: "#dc2626" }}
                      onPress={() =>
                        handleLancarOcorrencia(item.documento, item.frete)
                      }
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

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex-1 items-center justify-center bg-black/60">
            <View className="w-11/12 rounded-lg bg-blue-900 p-5">
              <Pressable
                className="absolute right-3 top-3 h-8 w-8 items-center justify-center rounded-full bg-white"
                onPress={() => {
                  setModalVisible(false);
                  setSelectedItem(null);
                }}
              >
                <P className="text-black">X</P>
              </Pressable>

              {selectedItem && (
                <View>
                  <H4 className="text-white">Detalhes da Ocorrência</H4>
                  <P className="mt-3 text-white">Frete: {selectedItem.frete}</P>
                  <P className="text-white">CTE: {selectedItem.cte}</P>
                  <P className="text-white">
                    Destino: {selectedItem.destinatario}
                  </P>
                  <P className="text-white">Cidade: {selectedItem.cidade}</P>
                  <P className="text-white">UF: {selectedItem.uf}</P>
                  <P className="text-white">Status: {selectedItem.status}</P>
                  <P className="text-white">
                    Ocorrência: {selectedItem.ocorrencia}
                  </P>
                </View>
              )}
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={!!ocorrenciaData}
          onRequestClose={() => setOcorrenciaData(null)}
        >
          <View className="flex-1 items-center justify-center bg-black/60">
            <View className="w-11/12 rounded-lg bg-white p-5">
              <TouchableOpacity
                className="absolute right-3 top-3 h-8 w-8 items-center justify-center rounded-full bg-gray-300"
                onPress={() => setOcorrenciaData(null)}
              >
                <P className="text-black">X</P>
              </TouchableOpacity>

              {ocorrenciaData && (
                <View className="gap-8">
                  <H4 className="text-black">Detalhes da Ocorrência</H4>
                  <P className="text-black">
                    Ocorrência: {ocorrenciaData.ocorrencia}
                  </P>
                  <P className="text-black">
                    Data: {ocorrenciaData.data_ocorrencia}
                  </P>
                  <P className="text-black">
                    Hora: {ocorrenciaData.hora_ocorrencia}
                  </P>
                  <P className="text-black">
                    Observação: {ocorrenciaData.observacao || "Nenhuma"}
                  </P>
                </View>
              )}
            </View>
          </View>
        </Modal>

        {isBottomSheetOpen && (
          <BottomSheet
            ref={bottomSheetRef}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            onClose={() => {
              setIsBottomSheetOpen(false);
              setIsLote(false);
              setLoteDocs([]);
              setLoteFretes([]);
            }}
          >
            <BottomSheetView className="flex-1 p-4">
              <H4 className="mb-4">Lançar Ocorrência</H4>
              {isLote && loteDocs.length > 0 && (
                <View className="mb-4">
                  <P className="mb-2 font-bold text-blue-900">
                    Ocorrência em lote para os documentos/fretes:
                  </P>
                  <P className="text-xs text-blue-900">
                    {loteDocs.map(
                      (doc, idx) =>
                        ` Doc: ${doc} - Frete: ${loteFretes[idx]} | `,
                    )}
                  </P>
                </View>
              )}

              <View className="mb-4">
                <P className="mb-2">Documento / NF:</P>
                <TextInput
                  className="h-12 rounded-lg border border-gray-300 px-4"
                  value={isLote ? loteDocs.join(", ") : documento}
                  editable={false}
                  onChangeText={setDocumento}
                  keyboardType="numeric"
                />
              </View>

              <View className="mb-4">
                <P className="mb-2">Frete:</P>
                <TextInput
                  className="h-12 rounded-lg border border-gray-300 px-4"
                  value={isLote ? loteFretes.join(", ") : frete}
                  onChangeText={setFrete}
                  editable={false}
                  keyboardType="numeric"
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
