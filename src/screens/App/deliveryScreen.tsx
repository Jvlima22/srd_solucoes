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
import { useEffect, useState, useMemo, useRef } from "react";
import { getInfoEntrega, updateOcorrenciaEntrega } from "@/service/services";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import MaskInput from "react-native-mask-input";
import { useRoute, RouteProp } from "@react-navigation/native";

type DeliveryScreenParams = {
  manifestoId: string;
};

type DeliveryScreenRouteProp = RouteProp<
  { params: DeliveryScreenParams },
  "params"
>;

export function DeliveryScreen() {
  const route = useRoute<DeliveryScreenRouteProp>();
  const manifestoId = route.params?.manifestoId || "1"; // Default to "1" if not provided
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

      await updateOcorrenciaEntrega(Number(documento), {
        data_ocorrencia: data,
        hora_ocorrencia: hora,
        observacao: observacao,
        ocorrencia: selectedOcorrencia,
      });

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
        <H4 className="font-bold">Relação de Entrega</H4>

        <FlatList
          data={entregas}
          keyExtractor={(item, index) => String(item.cte + "srp" + index)}
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
                <View className="mb-3 w-1/2 flex-row items-center justify-center gap-3 self-center rounded-lg bg-system p-3">
                  <P className="text-white">DOCUMENTO</P>

                  <View className="h-8 w-8 items-center justify-center rounded-full bg-white">
                    <P>{item.documento}</P>
                  </View>
                </View>

                <View className="flex-col">
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
                    <P className="text-sm font-bold">Status - {item.status}</P>
                  </View>

                  <View className="flex-row items-center gap-3">
                    <P className="text-sm">Ocorrência - {item.ocorrencia}</P>
                  </View>
                </View>

                <View className="mt-8 items-center justify-center">
                  <Button
                    className="w-1/3"
                    size={"icon"}
                    variant="default"
                    // onPress={() => alert('Detalhes')}
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
                    size="icon"
                    className="w-1/3 min-w-[200px]"
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
          )}
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
            onClose={() => setIsBottomSheetOpen(false)}
          >
            <BottomSheetView className="flex-1 p-4">
              <H4 className="mb-4">Lançar Ocorrência</H4>

              <View className="mb-4">
                <P className="mb-2">Documento / NF:</P>
                <TextInput
                  className="h-12 rounded-lg border border-gray-300 px-4"
                  value={documento}
                  editable={false}
                  onChangeText={setDocumento}
                  keyboardType="numeric"
                />
              </View>

              <View className="mb-4">
                <P className="mb-2">Frete:</P>
                <TextInput
                  className="h-12 rounded-lg border border-gray-300 px-4"
                  value={frete}
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
