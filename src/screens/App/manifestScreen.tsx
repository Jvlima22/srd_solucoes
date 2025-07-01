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
import { getInfoManifest, iniciarTransporte } from "@/service/services";
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

  // Lista de ocorrências que tornam o botão inativo
  const ocorrenciasInativas = [
    "Entrega realizado normalmente",
    "Coleta realizado normalmente",
    "Despacho realizado",
    "Retirada realizada",
    "Transferencia realizada",
  ];

  // Função auxiliar para determinar o texto do botão baseado no status da operação e ocorrência
  const getButtonText = (operationStatus: string, ocorrencia?: string) => {
    // Se a ocorrência for inativa, exibe "Inativo"
    if (ocorrencia && ocorrenciasInativas.includes(ocorrencia)) {
      return "Inativo";
    }

    // Só fica "Inativo" quando a ocorrência for "0 / 0"
    if (operationStatus === "0 / 0") {
      return "Inativo";
    }

    // Todos os demais casos ficam como "Baixar"
    return "Baixar";
  };

  // Função auxiliar para determinar se o botão deve estar desabilitado
  const isButtonDisabled = (operationStatus: string, ocorrencia?: string) => {
    // Se a ocorrência for inativa, desabilita o botão
    if (ocorrencia && ocorrenciasInativas.includes(ocorrencia)) {
      return true;
    }

    // Só desabilita quando a ocorrência for "0 / 0"
    if (operationStatus === "0 / 0") {
      return true;
    }

    // Todos os demais casos ficam habilitados
    return false;
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      console.log("ROUTES", user?.name);
      // Passar o id_motorista para filtrar apenas os manifestos do motorista logado
      const response = await getInfoManifest(user?.id);
      console.log("Manifestos recebidos:", response.data);
      console.log("Quantidade de manifestos:", response.data.length);
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
      // Passar o id_motorista para filtrar apenas os manifestos do motorista logado
      const response = await getInfoManifest(user?.id);
      setManifests(response.data);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.id]); // Adicionar user?.id como dependência para recarregar quando o usuário mudar

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

  console.log("Manifests state:", manifests);
  console.log("Filtered manifests:", filteredManifests);

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

  const handleStartTransport = async () => {
    if (!pendingManifestId || !user?.id || !dataSaida || !horaSaida) return;
    setSending(true);
    try {
      console.log("Iniciando transporte com dados:", {
        id_manifesto: pendingManifestId,
        id_motorista: user.id,
        data_saida: dataSaida,
        hora_saida: horaSaida,
      });

      const response = await api.post("/transporte/iniciar", {
        id_manifesto: pendingManifestId,
        id_motorista: user.id,
        data_saida: dataSaida,
        hora_saida: horaSaida,
      });

      console.log("Resposta do servidor:", response.data);

      if (response.data && response.data.success) {
        setShowStartTransportModal(false);
        setPendingManifestId(null);
        setDataSaida("");
        setHoraSaida("");
        await fetchData();
        alert("Transporte iniciado com sucesso!");
      } else {
        alert(response.data?.error || "Erro ao iniciar transporte.");
      }
    } catch (error: any) {
      console.error("Erro detalhado:", error);
      console.error("Status do erro:", error.response?.status);
      console.error("Dados do erro:", error.response?.data);

      if (error.response?.status === 403) {
        alert(
          "Erro 403: Acesso negado. Verifique se você tem permissão para iniciar transportes.",
        );
      } else if (error.response?.status === 400) {
        alert("Erro 400: Dados inválidos. Verifique os dados enviados.");
      } else {
        alert(
          `Erro ao iniciar transporte: ${error.message || "Tente novamente."}`,
        );
      }
    } finally {
      setSending(false);
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

  console.log(
    "Rendering with manifests:",
    manifests.length,
    "filtered:",
    filteredManifests.length,
  );

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
                      onPress={() => {
                        console.log(
                          "Status do manifesto:",
                          item.status_nome,
                          item,
                        );
                        if (item.status_nome === "EM TRANSITO") {
                          handleNavigateToScreen("entrega", item.id_manifesto);
                        } else {
                          setPendingManifestId(item.id_manifesto);
                          setShowStartTransportModal(true);
                        }
                      }}
                      style={{ backgroundColor: "#439943" }}
                    >
                      <P className="text-xs text-white">
                        {getButtonText(item.entrega)}
                      </P>
                    </Button>
                    <Image source={ArrowRight} className="h-7 w-7" />

                    <P>Entrega - {item.entrega}</P>
                  </View>

                  <View className="flex-row items-center gap-3">
                    <Button
                      className="h-[30px] w-[80px] items-center justify-center rounded-lg"
                      onPress={() => {
                        if (item.status_nome === "EM TRANSITO") {
                          handleNavigateToScreen("coleta", item.id_manifesto);
                        } else {
                          setPendingManifestId(item.id_manifesto);
                          setShowStartTransportModal(true);
                        }
                      }}
                      style={{ backgroundColor: "#ED9C2A" }}
                      disabled={isButtonDisabled(item.coleta)}
                    >
                      <P className="text-xs text-white">
                        {getButtonText(item.coleta)}
                      </P>
                    </Button>
                    <Image source={ArrowLeft} className="h-7 w-7" />

                    <P>Coleta - {item.coleta}</P>
                  </View>

                  <View className="flex-row items-center gap-3">
                    <Button
                      className="h-[30px] w-[80px] items-center justify-center rounded-lg"
                      onPress={() => {
                        if (item.status_nome === "EM TRANSITO") {
                          handleNavigateToScreen("despacho", item.id_manifesto);
                        } else {
                          setPendingManifestId(item.id_manifesto);
                          setShowStartTransportModal(true);
                        }
                      }}
                      style={{ backgroundColor: "#2E6EA5" }}
                      disabled={isButtonDisabled(item.despacho)}
                    >
                      <P className="text-xs text-white">
                        {getButtonText(item.despacho)}
                      </P>
                    </Button>
                    <Image source={ArrowUp} className="h-7 w-7" />

                    <P>Despacho - {item.despacho}</P>
                  </View>

                  <View className="flex-row items-center gap-3">
                    <Button
                      className="h-[30px] w-[80px] items-center justify-center rounded-lg"
                      onPress={() => {
                        if (item.status_nome === "EM TRANSITO") {
                          handleNavigateToScreen("retirada", item.id_manifesto);
                        } else {
                          setPendingManifestId(item.id_manifesto);
                          setShowStartTransportModal(true);
                        }
                      }}
                      style={{ backgroundColor: "#28A4C9" }}
                      disabled={isButtonDisabled(item.retirada)}
                    >
                      <P className="text-xs text-white">
                        {getButtonText(item.retirada)}
                      </P>
                    </Button>
                    <Image source={ArrowDown} className="h-7 w-7" />

                    <P>Retirada - {item.retirada}</P>
                  </View>

                  <View className="flex-row items-center gap-3">
                    <Button
                      className="h-[30px] w-[80px] items-center justify-center rounded-lg"
                      onPress={() => {
                        if (item.status_nome === "EM TRANSITO") {
                          handleNavigateToScreen(
                            "transferencia",
                            item.id_manifesto,
                          );
                        } else {
                          setPendingManifestId(item.id_manifesto);
                          setShowStartTransportModal(true);
                        }
                      }}
                      style={{ backgroundColor: "#EEEEEE" }}
                      disabled={isButtonDisabled(item.transferencia)}
                    >
                      <P className="text-xs text-black">
                        {getButtonText(item.transferencia)}
                      </P>
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
                <View>
                  <P>Detalhes das ocorrências aqui...</P>
                </View>
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
              <H3 className="mb-4 text-center">Iniciar Transporte</H3>
              <P>Data Saída:</P>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.7}
              >
                <TextInput
                  className={`h-12 rounded-lg border px-4`}
                  style={{
                    borderColor: "#ccc",
                    borderWidth: 1,
                    marginBottom: 10,
                  }}
                  value={
                    dataSaida ? dataSaida.split("-").reverse().join("/") : ""
                  }
                  editable={false}
                  placeholder="DD/MM/AAAA"
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
                initialDate={
                  dataSaida
                    ? (() => {
                        const [y, m, d] = dataSaida.split("-");
                        return new Date(`${y}-${m}-${d}`);
                      })()
                    : undefined
                }
              />

              <P>Hora Saída:</P>
              <TouchableOpacity
                onPress={() => setShowTimePicker(true)}
                activeOpacity={0.7}
              >
                <TextInput
                  className={`h-12 rounded-lg border px-4`}
                  style={{
                    borderColor: "#ccc",
                    borderWidth: 1,
                    marginBottom: 20,
                  }}
                  value={horaSaida}
                  editable={false}
                  placeholder="HH:MM"
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
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 20,
                }}
              >
                <Button
                  style={{
                    backgroundColor:
                      sending || !dataSaida || !horaSaida
                        ? "#a5a5d6"
                        : "#1e3a8a",
                    borderRadius: 4,
                    width: 110,
                    height: 36,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={handleStartTransport}
                  disabled={sending || !dataSaida || !horaSaida}
                >
                  <P
                    style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}
                  >
                    SALVAR
                  </P>
                </Button>
                <Button
                  style={{
                    backgroundColor: "#1e3a8a",
                    borderRadius: 4,
                    width: 110,
                    height: 36,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => setShowStartTransportModal(false)}
                >
                  <P
                    style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}
                  >
                    VOLTAR
                  </P>
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ContainerAppCpX>
  );
}
