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
import { getInfoColeta, updateOcorrenciaColeta } from "@/service/services";
import { CustomModal } from "@/components/CustomModal";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import MaskInput from "react-native-mask-input";
import { useRoute, RouteProp } from "@react-navigation/native";

type CollectionScreenParams = {
  manifestoId: string;
};

type CollectionScreenRouteProp = RouteProp<
  { params: CollectionScreenParams },
  "params"
>;

export function CollectionScreen() {
  const route = useRoute<CollectionScreenRouteProp>();
  const manifestoId = route.params?.manifestoId || "1"; // Default to "1" if not provided
  const [entregas, setEntregas] = useState<coletaDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<coletaDTO | null>(null);

  // Estados para o lançamento de ocorrência
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [selectedOcorrencia, setSelectedOcorrencia] = useState("");
  const [isOcorrenciaSheetOpen, setIsOcorrenciaSheetOpen] = useState(false);
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [observacao, setObservacao] = useState("");
  const [coletaNumero, setColetaNumero] = useState("");
  const [expedidor, setExpedidor] = useState("");
  const [documento, setDocumento] = useState("");
  const [arquivo, setArquivo] = useState<string | null>(null);

  const ocorrencias = [
    "coleta cancelada",
    "Filial",
    "Coleta realizado normalmente",
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getInfoColeta(manifestoId);
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
      const response = await getInfoColeta(manifestoId);
      setEntregas(response.data);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleLancarOcorrencia = (item: coletaDTO) => {
    setColetaNumero(item.coleta.toString());
    setIsBottomSheetOpen(true);
    bottomSheetRef.current?.expand();
  };

  const handleSalvarOcorrencia = async () => {
    try {
      if (!selectedOcorrencia || !data || !hora) {
        alert("Por favor, preencha todos os campos obrigatórios");
        return;
      }

      // Validação adicional para "Coleta realizado normalmente"
      if (selectedOcorrencia === "Coleta realizado normalmente") {
        if (!expedidor || !documento) {
          alert("Por favor, preencha expedidor e documento");
          return;
        }
      }

      const payload: any = {
        data_ocorrencia: data,
        hora_ocorrencia: hora,
        observacao: observacao,
        ocorrencia: selectedOcorrencia,
      };

      // Adiciona campos extras se for "Coleta realizado normalmente"
      if (selectedOcorrencia === "Coleta realizado normalmente") {
        payload.recebedor = expedidor;
        payload.documento_recebedor = documento;
        payload.id_tipo_recebedor = "teste1";
        payload.arquivo = "MOCK_ARQUIVO";
      }

      console.log(payload);

      await updateOcorrenciaColeta(Number(coletaNumero), payload);

      // Atualiza a lista de coletas
      await fetchData();

      // Fecha o bottom sheet e limpa o formulário
      bottomSheetRef.current?.close();
      setIsBottomSheetOpen(false);
      // Reset form
      setColetaNumero("");
      setData("");
      setHora("");
      setObservacao("");
      setSelectedOcorrencia("");
      setExpedidor("");
      setDocumento("");
      setArquivo(null);

      alert("Ocorrência salva com sucesso!");
    } catch (error) {
      console.error("Error saving ocorrencia:", error);
      alert("Erro ao salvar ocorrência. Por favor, tente novamente.");
    }
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
        <H4>Relação de Coleta</H4>

        <FlatList
          data={entregas}
          keyExtractor={(item, index) => String(item.coleta + "srp" + index)}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListEmptyComponent={() => (
            <View className="flex-1 items-center justify-center">
              <H4 className="mt-10">Sem dados no momento...</H4>
            </View>
          )}
          renderItem={({ item }) => (
            <View className="mt-5">
              <View className="rounded-lg border border-zinc-600 p-5">
                <View className="mb-5 w-1/2 flex-row items-center justify-center gap-3 self-center rounded-lg bg-blue-900 p-3">
                  <P className="text-white">COLETA</P>

                  <View className="h-8 w-8 items-center justify-center rounded-full bg-white">
                    <P>{item.coleta}</P>
                  </View>
                </View>

                <View className="flex-col">
                  <View className="flex-row items-center gap-3">
                    <P className="text-sm font-bold">
                      Total Documento - {item.totalDocumento}
                    </P>
                  </View>

                  <View className="flex-row items-center gap-3">
                    <P className="text-sm">Volume - {item.volume || "N/A"}</P>
                  </View>

                  <View className="flex-row items-center gap-3">
                    <P className="text-sm">Peso - {item.peso} kg</P>
                  </View>

                  <View className="flex-row items-center gap-3">
                    <P className="text-sm">
                      Local - {item.destinatario || "N/A"}
                    </P>
                  </View>

                  <View className="flex-row items-center gap-3">
                    <P className="text-sm">Cidade - {item.cidade || "N/A"}</P>
                  </View>

                  <View className="flex-row items-center gap-3">
                    <P className="text-sm">UF - {item.uf || "N/A"}</P>
                  </View>

                  <View className="flex-row items-center gap-3">
                    <P className="text-sm font-bold">
                      Status - {item.status || "N/A"}
                    </P>
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

                <View className="mt-3 items-center justify-center">
                  <Button
                    size="icon"
                    className="w-1/3 min-w-[200px]"
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
          )}
        />

        <CustomModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        >
          {selectedItem && (
            <View>
              <H1 className="text-white">
                Coleta Número: {selectedItem.coleta}
              </H1>
              <P className="text-white">
                Total Documentos: {selectedItem.totalDocumento}
              </P>
              <P className="text-white">
                Volume: {selectedItem.volume || "N/A"}
              </P>
              <P className="text-white">Peso: {selectedItem.peso} kg</P>
              <P className="text-white">
                Local: {selectedItem.destinatario || "N/A"}
              </P>
              <P className="text-white">
                Cidade: {selectedItem.cidade || "N/A"}
              </P>
              <P className="text-white">UF: {selectedItem.uf || "N/A"}</P>
              <P className="text-white">
                Status: {selectedItem.status || "N/A"}
              </P>
            </View>
          )}
        </CustomModal>

        {isBottomSheetOpen && (
          <BottomSheet
            ref={bottomSheetRef}
            snapPoints={["25%", "50%", "90%"]}
            enablePanDownToClose={true}
            onClose={() => setIsBottomSheetOpen(false)}
          >
            <BottomSheetView className="flex-1 p-4">
              <ScrollView showsVerticalScrollIndicator={false}>
                <H4 className="mb-4">Lançar Ocorrência</H4>

                <View className="mb-4">
                  <P className="mb-2">Coleta Número:</P>
                  <TextInput
                    className="h-12 rounded-lg border border-gray-300 px-4"
                    value={coletaNumero}
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

                {selectedOcorrencia === "Coleta realizado normalmente" && (
                  <>
                    <View className="mb-4">
                      <P className="mb-2">Expedidor:</P>
                      <TextInput
                        className="h-12 rounded-lg border border-gray-300 px-4"
                        value={expedidor}
                        onChangeText={setExpedidor}
                        placeholder="Digite o expedidor"
                      />
                    </View>

                    <View className="mb-4">
                      <P className="mb-2">Documento:</P>
                      <TextInput
                        className="h-12 rounded-lg border border-gray-300 px-4"
                        value={documento}
                        onChangeText={setDocumento}
                        placeholder="Digite o documento"
                      />
                    </View>

                    <View className="mb-4">
                      <P className="mb-2">Arquivo:</P>
                      <Button
                        className="h-12 rounded-lg border border-gray-300"
                        onPress={() => setArquivo("MOCK_ARQUIVO")}
                      >
                        <P className="text-white">
                          {arquivo
                            ? "Arquivo selecionado"
                            : "Selecionar arquivo"}
                        </P>
                      </Button>
                    </View>
                  </>
                )}

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
