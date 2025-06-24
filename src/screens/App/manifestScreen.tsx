import React, { createRef, useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  FlatList,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  View,
  Pressable,
  Modal,
  Text,
} from "react-native";
import { Button } from "@components/Button";
import { ContainerAppCpX } from "@components/ContainerAppCpX";
import { H3, H4, P } from "@components/Typography";
import { ChevronDown as IconDown } from "lucide-react-native";
import {
  useNavigation,
  useRoute,
  RouteProp,
  NavigationProp,
} from "@react-navigation/native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/service/api";
import { CustomDateTimePicker } from "@components/DateTimePickerModal";

import ArrowRight from "@assets/Arrow-right.png";
import ArrowLeft from "@assets/Arrow-left.png";
import ArrowUp from "@assets/Arrow-up.png";
import ArrowDown from "@assets/Arrow-down.png";
import CurvedArrow from "@assets/Curved-Arrow.png";
import {
  BottomSheetPickerChoiceRef,
  BottomSheetPicker,
} from "@components/BottomSheetPicker";
import { getInfoManifest } from "@/service/services";
import type { RootStackParamList } from "../../@types/routes";

interface RootObject {
  tipo: string;
  documento?: number;
  frete?: number;
  cte?: string;
  destinatario?: string;
  cidade: string;
  uf: string;
  status: string;
  ocorrencia?: string;
  coleta_numero?: number;
  total_documento?: number;
  local?: string;
  minuta_numero?: number;
  total_frete?: number;
  total_volume?: number;
}

// Definir o tipo dos parâmetros de rota para ManifestScreen
type ManifestScreenParams = {
  manifestoId: number;
};

export function ManifestScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route =
    useRoute<RouteProp<{ params: ManifestScreenParams }, "params">>();
  const manifestoId = route.params?.manifestoId ?? null;
  const [selectStatus, setSelectStatus] = useState<{
    name: string;
    value: string;
  } | null>(null);
  const bottomSheetPicker = createRef<BottomSheetPickerChoiceRef>();
  const bottomSheetRef = createRef<BottomSheet>();

  const [manifests, setManifests] = useState<manifestDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [ocorrencias] = useState<RootObject[]>([]);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const { user } = useAuth();
  const [showStartTransportModal, setShowStartTransportModal] = useState(false);
  const [pendingManifestId, setPendingManifestId] = useState<number | null>(
    null,
  );
  const [dataSaida, setDataSaida] = useState("");
  const [horaSaida, setHoraSaida] = useState("");
  const [sending, setSending] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getInfoManifest();
      setManifests(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await getInfoManifest();
      setManifests(response.data);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredManifests = manifests.filter((manifest) => {
    // Se houver manifestoId na rota, filtra por ele
    if (manifestoId !== null && manifest.id_manifesto !== manifestoId) {
      return false;
    }
    // Se houver searchTerm, filtra por número do manifesto
    if (searchTerm && !manifest.id_manifesto.toString().includes(searchTerm)) {
      return false;
    }
    // Se houver statusFilter, filtra por status ID
    if (statusFilter && statusFilter !== "") {
      if (String(manifest.status) !== statusFilter) {
        return false;
      }
    }
    return true;
  });

  const handleNavigateToScreen = (tipo: string, manifestoId: number) => {
    setModalVisible(false);
    bottomSheetRef.current?.close();

    switch (tipo.toLowerCase()) {
      case "entrega":
        navigation.navigate("DeliveryScreen", {
          manifestoId: String(manifestoId),
        });
        break;
      case "coleta":
        navigation.navigate("CollectionScreen", {
          manifestoId: String(manifestoId),
        });
        break;
      case "despacho":
        navigation.navigate("DispatchScreen", {
          manifestoId: String(manifestoId),
        });
        break;
      case "retirada":
        navigation.navigate("WithDrawalScreen", {
          manifestoId: String(manifestoId),
        });
        break;
      case "transferência":
      case "transferencia":
        navigation.navigate("TransferScreen", {
          manifestoId: String(manifestoId),
        });
        break;
      default:
        break;
    }
  };

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
      <View className="flex-1">
        <FlatList
          data={filteredManifests}
          keyExtractor={(item, index) => String(index)}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={onRefresh}
          contentContainerStyle={{
            padding: 20,
          }}
          ListEmptyComponent={() => (
            <View className="flex-1 items-center justify-center">
              <H4 className="mt-10">Sem dados no momento...</H4>
            </View>
          )}
          ListHeaderComponent={() => (
            <View>
              <H4 className="font-bold">Relação de Manifesto</H4>

              <View className="mt-4 w-full gap-3">
                <H3 className="text-xl">Manifesto:</H3>
                <View
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.25, // Equivalent to #00000040
                    shadowRadius: 4,
                    elevation: 4, // For Android
                  }}
                  className="h-14 w-full rounded-xl bg-grayscale-0"
                >
                  <TextInput
                    className="flex-1 px-7"
                    placeholder="Digite o número do manifesto"
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View className="mt-4 w-full gap-3">
                <H3 className="text-xl">Status:</H3>
                <View
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.25, // Equivalent to #00000040
                    shadowRadius: 4,
                    elevation: 4, // For Android
                  }}
                  className="flex-row items-center rounded-xl bg-grayscale-0 px-3"
                  // className={`${Platform.OS === 'ios' ? 'shadow shadow-black/50' : 'elevation-4'}`}
                >
                  <Pressable
                    onPress={() => bottomSheetPicker.current?.showBottomSheet()} // Substitua o alert pelo comportamento desejado
                    style={{
                      flex: 1,
                      height: 50,
                      paddingLeft: 5,
                      justifyContent: "center",
                    }}
                  >
                    <TextInput
                      className="h-14 flex-1 pl-3"
                      editable={false}
                      placeholder="Selecione o status"
                      value={selectStatus?.name}
                      pointerEvents="none"
                    />
                  </Pressable>

                  <IconDown color={"#000"} size={24} />
                </View>
              </View>

              <View className="mt-8">
                <Button
                  className="w-1/2"
                  onPress={() => {
                    if (selectStatus) setStatusFilter(selectStatus.value);
                  }}
                >
                  <H3 className="text-base font-bold text-white">Pesquisar</H3>
                </Button>
              </View>
            </View>
          )}
          renderItem={({ item }) => (
            <View className="mt-8">
              <View className="rounded-lg border border-zinc-600 p-5">
                <View className="mb-5 w-1/2 flex-row items-center justify-center gap-3 self-center rounded-lg bg-blue-900 p-3">
                  <P className="text-white">MANIFESTO</P>

                  <View className="h-8 w-8 items-center justify-center rounded-full bg-white">
                    <P>{item.id_manifesto}</P>
                  </View>
                </View>

                <View className="flex-col gap-3">
                  <View className="flex-row items-center gap-3">
                    <Button
                      className="h-[30px] w-[80px] items-center justify-center rounded-lg"
                      onPress={() =>
                        handleNavigateToScreen("entrega", item.id_manifesto)
                      }
                      style={{ backgroundColor: "#439943" }}
                    >
                      <P className="text-xs text-white">Baixar</P>
                    </Button>
                    <Image source={ArrowRight} className="h-7 w-7" />

                    <P>Entrega - {item.entrega}</P>
                  </View>

                  <View className="flex-row items-center gap-3">
                    <Button
                      className="h-[30px] w-[80px] items-center justify-center rounded-lg"
                      onPress={() =>
                        handleNavigateToScreen("coleta", item.id_manifesto)
                      }
                      style={{ backgroundColor: "#ED9C2A" }}
                    >
                      <P className="text-xs text-white">Baixar</P>
                    </Button>
                    <Image source={ArrowLeft} className="h-7 w-7" />

                    <P>Coleta - {item.coleta}</P>
                  </View>

                  <View className="flex-row items-center gap-3">
                    <Button
                      className="h-[30px] w-[80px] items-center justify-center rounded-lg"
                      onPress={() =>
                        handleNavigateToScreen("despacho", item.id_manifesto)
                      }
                      style={{ backgroundColor: "#2E6EA5" }}
                    >
                      <P className="text-xs text-white">Baixar</P>
                    </Button>
                    <Image source={ArrowUp} className="h-7 w-7" />

                    <P>Despacho - {item.despacho}</P>
                  </View>

                  <View className="flex-row items-center gap-3">
                    <Button
                      className="h-[30px] w-[80px] items-center justify-center rounded-lg"
                      onPress={() =>
                        handleNavigateToScreen("retirada", item.id_manifesto)
                      }
                      style={{ backgroundColor: "#28A4C9" }}
                    >
                      <P className="text-xs text-white">Baixar</P>
                    </Button>
                    <Image source={ArrowDown} className="h-7 w-7" />

                    <P>Retirada - {item.retirada}</P>
                  </View>

                  <View className="flex-row items-center gap-3">
                    <Button
                      className="h-[30px] w-[80px] items-center justify-center rounded-lg"
                      onPress={() =>
                        handleNavigateToScreen(
                          "transferencia",
                          item.id_manifesto,
                        )
                      }
                      style={{ backgroundColor: "#EEEEEE" }}
                    >
                      <P className="text-xs text-black">Baixar</P>
                    </Button>
                    <Image source={CurvedArrow} className="h-7 w-7" />

                    <P>Transferência - {item.transferencia}</P>
                  </View>
                </View>

                <View className="mt-8 items-center justify-center">
                  <Button
                    className="w-1/2"
                    style={{
                      backgroundColor:
                        item.status_nome === "EM ABERTO"
                          ? "#dc2626"
                          : "#1e40af",
                    }}
                    onPress={() => {
                      if (item.status_nome === "EM ABERTO") {
                        setPendingManifestId(item.id_manifesto);
                        setShowStartTransportModal(true);
                      }
                    }}
                    disabled={item.status_nome !== "EM ABERTO"}
                  >
                    <H3 className="text-base font-bold text-white">
                      {item.status_nome === "EM ABERTO"
                        ? "Iniciar transporte"
                        : item.status_nome}
                    </H3>
                  </Button>
                </View>
              </View>
            </View>
          )}
        />
        <BottomSheetPicker
          ref={bottomSheetPicker}
          selected={selectStatus}
          data={[
            { name: "...", value: "" },
            { name: "EM ABERTO", value: "1" },
            { name: "EM TRANSITO", value: "4" },
            { name: "FINALIZADO", value: "8" },
          ]}
          onChangeValue={(value) => {
            setSelectStatus(value);
            setStatusFilter(value.value);
          }}
        />
        {modalVisible && (
          <BottomSheet
            ref={bottomSheetRef}
            snapPoints={["25%", "50%", "90%"]}
            enablePanDownToClose={true}
            onClose={() => setModalVisible(false)}
          >
            <BottomSheetView className="flex-1 p-4">
              <ScrollView showsVerticalScrollIndicator={false}>
                <View className="mb-4 flex-row items-center justify-between">
                  <H4>Detalhes das Ocorrências</H4>
                  <TouchableOpacity
                    className="h-8 w-8 items-center justify-center rounded-full bg-gray-200"
                    onPress={() => {
                      setModalVisible(false);
                      bottomSheetRef.current?.close();
                    }}
                  >
                    <P>X</P>
                  </TouchableOpacity>
                </View>

                {ocorrencias.map((ocorrencia, index) => (
                  <View
                    key={index}
                    className="mb-5 rounded-lg bg-white p-4 shadow"
                  >
                    <View className="mb-2 border-b border-gray-200 pb-2">
                      <H4 className="text-blue-900">Ocorrência #{index + 1}</H4>
                    </View>

                    {Object.entries(ocorrencia).map(([key, value]) => {
                      if (key === "tipo" && value) {
                        return (
                          <View key={key} className="mt-4">
                            <Button
                              onPress={() => {
                                setModalVisible(false);
                              }}
                              className="bg-blue-900"
                            >
                              <P className="text-white">Ir para {value}</P>
                            </Button>
                          </View>
                        );
                      }
                      return (
                        <View key={key} className="flex-row py-1">
                          <P className="font-bold capitalize">
                            {key.replace("_", " ")}:{" "}
                          </P>
                          <P>{String(value)}</P>
                        </View>
                      );
                    })}
                  </View>
                ))}
              </ScrollView>
            </BottomSheetView>
          </BottomSheet>
        )}
        <Modal
          visible={showStartTransportModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowStartTransportModal(false)}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <View
              style={{
                width: 340,
                backgroundColor: "white",
                borderRadius: 10,
                padding: 20,
              }}
            >
              <H4 className="mb-4 text-center">Iniciar Transporte</H4>
              <View style={{ marginBottom: 12 }}>
                <Text>Data saída:</Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 4,
                  }}
                  activeOpacity={0.7}
                >
                  <TextInput
                    value={dataSaida}
                    editable={false}
                    placeholder="AAAA-MM-DD"
                    style={{
                      borderWidth: 1,
                      borderColor: "#ccc",
                      borderRadius: 6,
                      padding: 8,
                      flex: 1,
                      color: dataSaida ? "#000" : "#888",
                    }}
                    pointerEvents="none"
                  />
                </TouchableOpacity>
                <CustomDateTimePicker
                  visible={showDatePicker}
                  mode="date"
                  onConfirm={(date) => {
                    setShowDatePicker(false);
                    const formatted = date.toISOString().split("T")[0];
                    setDataSaida(formatted);
                  }}
                  onCancel={() => setShowDatePicker(false)}
                  initialDate={dataSaida ? new Date(dataSaida) : undefined}
                />
              </View>
              <View style={{ marginBottom: 12 }}>
                <Text>Hora saída:</Text>
                <TouchableOpacity
                  onPress={() => setShowTimePicker(true)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 4,
                  }}
                  activeOpacity={0.7}
                >
                  <TextInput
                    value={horaSaida}
                    editable={false}
                    placeholder="HH:MM"
                    style={{
                      borderWidth: 1,
                      borderColor: "#ccc",
                      borderRadius: 6,
                      padding: 8,
                      flex: 1,
                      color: horaSaida ? "#000" : "#888",
                    }}
                    pointerEvents="none"
                  />
                </TouchableOpacity>
                <CustomDateTimePicker
                  visible={showTimePicker}
                  mode="time"
                  onConfirm={(date) => {
                    setShowTimePicker(false);
                    const formatted = date.toTimeString().slice(0, 5);
                    setHoraSaida(formatted);
                  }}
                  onCancel={() => setShowTimePicker(false)}
                  initialDate={
                    horaSaida
                      ? (() => {
                          const [h, m] = horaSaida.split(":");
                          const d = new Date();
                          d.setHours(Number(h));
                          d.setMinutes(Number(m));
                          d.setSeconds(0);
                          d.setMilliseconds(0);
                          return d;
                        })()
                      : undefined
                  }
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 16,
                }}
              >
                <Button
                  style={{
                    backgroundColor: "#ED9C2A",
                    flex: 1,
                    marginRight: 8,
                  }}
                  onPress={() => setShowStartTransportModal(false)}
                >
                  <H3 className="text-base font-bold text-white">Voltar</H3>
                </Button>
                <Button
                  style={{ backgroundColor: "#1e40af", flex: 1, marginLeft: 8 }}
                  disabled={sending || !dataSaida || !horaSaida}
                  onPress={async () => {
                    if (
                      !pendingManifestId ||
                      !user?.id ||
                      !dataSaida ||
                      !horaSaida
                    )
                      return;
                    setSending(true);
                    try {
                      await api.post("/transporte/iniciar", {
                        id_manifesto: pendingManifestId,
                        id_motorista: user.id,
                        data_saida: dataSaida,
                        hora_saida: horaSaida,
                      });
                      setShowStartTransportModal(false);
                      setPendingManifestId(null);
                      setDataSaida("");
                      setHoraSaida("");
                      const novosManifests = await fetchData(); // Aguarda atualizar a lista e pega o novo array
                      const manifestoAtualizado = novosManifests.find(
                        (m) => m.id_manifesto === pendingManifestId,
                      );
                      if (manifestoAtualizado) {
                      }
                    } catch {
                      alert("Erro ao iniciar transporte.");
                    } finally {
                      setSending(false);
                    }
                  }}
                >
                  <H3 className="text-base font-bold text-white">Salvar</H3>
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ContainerAppCpX>
  );
}
