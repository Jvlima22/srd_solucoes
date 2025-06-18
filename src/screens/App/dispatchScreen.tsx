import { Button } from "@components/Button";
import { ContainerAppCpX } from "@components/ContainerAppCpX";
import { H3, H4, P } from "@components/Typography";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";

import { useEffect, useRef, useState } from "react";
import { getInfoDespacho, updateOcorrenciaDespacho } from "@/service/services";
import { CustomModal } from "@/components/CustomModal";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import MaskInput from "react-native-mask-input";
import { useRoute, RouteProp } from "@react-navigation/native";

type DispatchScreenParams = {
  manifestoId: string;
};

type DispatchScreenRouteProp = RouteProp<
  { params: DispatchScreenParams },
  "params"
>;

export function DispatchScreen() {
  const route = useRoute<DispatchScreenRouteProp>();
  const manifestoId = route.params?.manifestoId || "1"; // Default to "1" if not provided
  const [entregas, setEntregas] = useState<despachoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<despachoDTO | null>(null);

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
    "Despacho cancelado",
    "Filial",
    "Despacho realizado normalmente",
  ];

  const handleLancarOcorrencia = (item: despachoDTO) => {
    setMinutaNumero(item.minutaDespacho?.toString() || "");
    setIsBottomSheetOpen(true);
    bottomSheetRef.current?.expand();
  };

  const handleSalvarOcorrencia = async () => {
    try {
      if (!selectedOcorrencia || !data || !hora || !observacao) {
        alert("Por favor, preencha todos os campos obrigatórios");
        return;
      }

      const payload = {
        ocorrencia: selectedOcorrencia,
        data_ocorrencia: data,
        hora_ocorrencia: hora,
        observacao: observacao,
      };

      await updateOcorrenciaDespacho(Number(minutaNumero), payload);

      // Atualiza a lista de despachos
      await fetchData();

      // Fecha o bottom sheet e limpa o formulário
      bottomSheetRef.current?.close();
      setIsBottomSheetOpen(false);
      // Reset form
      setMinutaNumero("");
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

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getInfoDespacho(manifestoId);
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
      const response = await getInfoDespacho(manifestoId);
      setEntregas(response.data);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
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
        <H4>Relação de Despacho</H4>

        <FlatList
          data={entregas}
          keyExtractor={(item, index) => String(item.frete + "srp" + index)}
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
                <View className="mb-5 w-1/2 flex-row items-center justify-center gap-3 self-center rounded-xl bg-blue-900 p-3">
                  <P className="text-white">FRETE</P>

                  <View className="h-8 w-8 items-center justify-center rounded-full bg-white">
                    <P>{item.frete}</P>
                  </View>
                </View>

                <View className="flex-col">
                  <View className="flex-row items-center gap-3">
                    <P className="text-sm font-bold">
                      Minuta Despacho - {item.minutaDespacho || "N/A"}
                    </P>
                  </View>

                  <View className="flex-row items-center gap-3">
                    <P className="text-sm">CTE - {item.CTE}</P>
                  </View>

                  <View className="flex-row items-center gap-3">
                    <P className="text-sm">Destino - {item.destino || "N/A"}</P>
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

                <View className="mt-8 items-center justify-center">
                  <Button
                    className="w-1/3"
                    size="icon"
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
              <H3 className="text-white">Frete Número: {selectedItem.frete}</H3>
              <P className="text-white">
                Minuta Despacho: {selectedItem.minutaDespacho || "N/A"}
              </P>
              <P className="text-white">CTE: {selectedItem.CTE}</P>
              <P className="text-white">
                Destino: {selectedItem.destino || "N/A"}
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
                  <P className="mb-2">Minuta Número:</P>
                  <TextInput
                    className="h-12 rounded-lg border border-gray-300 px-4"
                    value={minutaNumero}
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
