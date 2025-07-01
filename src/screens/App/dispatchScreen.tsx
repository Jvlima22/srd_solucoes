import { Button } from "@components/Button";
import { ContainerAppCpX } from "@components/ContainerAppCpX";
import { H4, P } from "@components/Typography";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import {
  getInfoDespacho,
  updateOcorrenciaDespacho,
  getDetalhesDespacho,
  deleteOcorrenciaDespacho,
} from "@/service/services";
import { controlarBotaoOcorrencia, converterTipoMovimento } from "@/lib/utils";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useRoute, RouteProp } from "@react-navigation/native";

import { Check, ChevronDown, Trash2 } from "lucide-react-native";
import type { DetalhesDespachoDTO } from "../../@types/detalhesDespachoDTO";
import { DetailsBottomSheet } from "@/components/DetailsBottomSheet";
import { CustomDateTimePicker } from "@components/DateTimePickerModal";
import { BackButton } from "@components/BackButton";
import {
  GenericListCard,
  GenericListCardConfigs,
} from "@components/GenericListCard";
import { CustomModal } from "@components/CustomModal";

type DispatchScreenParams = {
  manifestoId: string;
};

type DispatchScreenRouteProp = RouteProp<
  { params: DispatchScreenParams },
  "params"
>;

// Função utilitária para cor da borda dos campos obrigatórios
function getInputBorderColor(
  value: string | number | null | undefined,
  obrigatorio: boolean,
) {
  return obrigatorio && !value ? "#ef4444" : "#d1d5db"; // red-500 ou gray-300
}

export function DispatchScreen() {
  const route = useRoute<DispatchScreenRouteProp>();
  const manifestoId = route.params?.manifestoId;
  const [entregas, setEntregas] = useState<despachoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<despachoDTO | null>(null);
  const [selectedDocumentos, setSelectedDocumentos] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  // Para ocorrência em lote
  const [loteMinutas, setLoteMinutas] = useState<string[]>([]);
  const [loteFretes, setLoteFretes] = useState<string[]>([]);
  const [isLote, setIsLote] = useState(false);

  const snapPoints = useMemo(() => ["25%", "50%", "100%"], []);

  // Estados para o BottomSheet de detalhes
  const [isDetailsSheetOpen, setIsDetailsSheetOpen] = useState(false);
  const detailsBottomSheetRef = useRef<BottomSheet>(null);
  const [detalhesDespacho, setDetalhesDespacho] =
    useState<DetalhesDespachoDTO | null>(null);
  const [detalhesLoading, setDetalhesLoading] = useState(false);
  const [detailsSheetIndex, setDetailsSheetIndex] = useState(-1);

  // Estados para o picker de data/hora
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Estados para o lançamento de ocorrência
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [selectedOcorrencia, setSelectedOcorrencia] = useState<
    | "despacho cancelado"
    | "em transito para despacho"
    | "despacho realizado"
    | ""
  >("");
  const [isOcorrenciaSheetOpen, setIsOcorrenciaSheetOpen] = useState(false);
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [observacao, setObservacao] = useState("");
  const [minutaNumero, setMinutaNumero] = useState("");
  const [freteNumero, setFreteNumero] = useState("");

  // Estado para modal de exclusão
  const [deleteModal, setDeleteModal] = useState<null | {
    id: number;
    documento: number | string;
    ocorrencia: string;
    data: string;
    hora: string;
  }>(null);

  // Calcular se pode excluir ocorrência baseado no tipo_acao do item selecionado
  const podeExcluirOcorrencia = useMemo(() => {
    if (!selectedItem) return false;
    const tipoMovimento = converterTipoMovimento("dispatch");
    const tipoAcao = selectedItem.tipo_acao;
    return controlarBotaoOcorrencia(tipoMovimento, tipoAcao);
  }, [selectedItem]);

  const ocorrencias = [
    "despacho cancelado",
    "em transito para despacho",
    "despacho realizado",
  ];

  // Função para validar se todos os campos obrigatórios estão preenchidos
  const isFormValid = useMemo(() => {
    // Para despacho, observação é opcional
    return Boolean(selectedOcorrencia && data && hora);
  }, [selectedOcorrencia, data, hora]);

  const handleLancarOcorrencia = (item: despachoDTO) => {
    setMinutaNumero(item.minutaDespacho?.toString() || "");
    setFreteNumero(item.frete?.toString() || "");
    setIsBottomSheetOpen(true);
    bottomSheetRef.current?.expand();
  };

  // Selecionar/desmarcar todos
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedDocumentos([]);
      setSelectAll(false);
    } else {
      const allIds = entregas.map(
        (item) => String(item.minutaDespacho) + "-" + item.frete,
      );
      setSelectedDocumentos(allIds);
      setSelectAll(true);
    }
  };

  // GERAR OCORRÊNCIA EM LOTE
  const handleLancarOcorrenciaLote = () => {
    if (selectedDocumentos.length === 0) {
      alert("Selecione pelo menos um despacho para lançar ocorrência em lote.");
      return;
    }
    // Coletar todas as minutas e fretes selecionados
    const minutas: string[] = [];
    const fretes: string[] = [];
    selectedDocumentos.forEach((id) => {
      const item = entregas.find(
        (item) => String(item.minutaDespacho) + "-" + item.frete === id,
      );
      if (item) {
        minutas.push(String(item.minutaDespacho));
        fretes.push(String(item.frete));
      }
    });
    setLoteMinutas(minutas);
    setLoteFretes(fretes);
    setIsLote(true);
    setIsBottomSheetOpen(true);
    bottomSheetRef.current?.expand();
  };

  // Salvar ocorrência (individual ou em lote)
  const handleSalvarOcorrencia = async () => {
    try {
      // Para despacho, não exigir observacao
      if (!selectedOcorrencia || !data || !hora) {
        alert("Por favor, preencha todos os campos obrigatórios");
        return;
      }
      if (isLote && loteMinutas.length > 0) {
        for (let i = 0; i < loteMinutas.length; i++) {
          await updateOcorrenciaDespacho(Number(loteFretes[i]), {
            ocorrencia: selectedOcorrencia,
            data_ocorrencia: data,
            hora_ocorrencia: hora,
            observacao: observacao,
          });
        }
      } else {
        // Para ocorrência individual, usar o frete já capturado
        if (!freteNumero) {
          alert("Frete não encontrado");
          return;
        }
        await updateOcorrenciaDespacho(Number(freteNumero), {
          ocorrencia: selectedOcorrencia,
          data_ocorrencia: data,
          hora_ocorrencia: hora,
          observacao: observacao,
        });
      }
      await fetchData();
      bottomSheetRef.current?.close();
      setIsBottomSheetOpen(false);
      setIsLote(false);
      setLoteMinutas([]);
      setLoteFretes([]);
      setMinutaNumero("");
      setFreteNumero("");
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

  const handleOpenDetalhes = async (item: despachoDTO) => {
    setSelectedItem(item);
    setIsDetailsSheetOpen(true);
    setDetailsSheetIndex(1);
    setDetalhesLoading(true);
    setDetalhesDespacho(null);
    try {
      const response = await getDetalhesDespacho(String(item.frete));
      setDetalhesDespacho(response.data);
    } catch {
      alert("Não foi possível carregar os detalhes do despacho.");
      setDetailsSheetIndex(-1);
    } finally {
      setDetalhesLoading(false);
    }
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getInfoDespacho(manifestoId);
      setEntregas(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [manifestoId]);

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

  // Função para excluir ocorrência
  const handleDeleteOcorrencia = async (ocorrenciaId: number) => {
    try {
      await deleteOcorrenciaDespacho(ocorrenciaId.toString());
      if (selectedItem) {
        const response = await getDetalhesDespacho(String(selectedItem.frete));
        setDetalhesDespacho(response.data);
      }
      await fetchData();
      setDeleteModal(null);
      Alert.alert("Sucesso", "Ocorrência excluída com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir ocorrência:", error);
      setDeleteModal(null);
      Alert.alert(
        "Erro",
        "Erro ao excluir ocorrência. Por favor, tente novamente.",
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
    "isDetailsSheetOpen:",
    isDetailsSheetOpen,
    "detailsSheetIndex:",
    detailsSheetIndex,
  );

  return (
    <ContainerAppCpX>
      <View className="flex-1 p-7">
        <H4>Relação de Despacho</H4>

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

        <GenericListCard
          data={entregas}
          config={GenericListCardConfigs.dispatch}
          refreshing={refreshing}
          onRefresh={onRefresh}
          selectedItems={selectedDocumentos}
          setSelectedItems={setSelectedDocumentos}
          onOpenDetails={(item) => handleOpenDetalhes(item as despachoDTO)}
          onLancarOcorrencia={(item) =>
            handleLancarOcorrencia(item as despachoDTO)
          }
        />

        <DetailsBottomSheet
          isOpen={isDetailsSheetOpen}
          onClose={() => {
            setIsDetailsSheetOpen(false);
            setDetailsSheetIndex(-1);
          }}
          bottomSheetRef={detailsBottomSheetRef}
          title="Detalhes do despacho"
          primaryFields={[
            {
              label: "Número da Minuta",
              value: detalhesDespacho?.numero_minuta || "",
            },
            {
              label: "Frete",
              value: detalhesDespacho?.frete || "",
            },
          ]}
          columns={[
            { header: "Documento", accessor: "documento", flex: 1.5 },
            { header: "Ocorrência", accessor: "ocorrencia", flex: 2 },
            {
              header: "Data",
              accessor: "data",
              flex: 1.8,
              render: (item) => (
                <P style={{ textAlign: "center", color: "#222" }}>
                  {item.data || ""}
                </P>
              ),
            },
            {
              header: "Hora",
              accessor: "hora",
              flex: 1.1,
              render: (item) => (
                <P style={{ textAlign: "center", color: "#222" }}>
                  {item.hora || "N/A"}
                </P>
              ),
            },
            {
              header: "Excluir",
              accessor: "actions",
              flex: 1,
              render: (item) =>
                podeExcluirOcorrencia ? (
                  <TouchableOpacity
                    onPress={() =>
                      setDeleteModal({
                        id: item.id,
                        documento: item.documento,
                        ocorrencia: item.ocorrencia,
                        data: item.data,
                        hora: item.hora,
                      })
                    }
                  >
                    <Trash2 width={18} height={18} color="#ff0000" />
                  </TouchableOpacity>
                ) : (
                  <View
                    style={{ alignItems: "center", justifyContent: "center" }}
                  >
                    <P style={{ color: "#999", fontSize: 12 }}>-</P>
                  </View>
                ),
            },
          ]}
          data={detalhesDespacho?.ocorrencias || []}
          isLoading={detalhesLoading}
          sheetIndex={detailsSheetIndex}
          setSheetIndex={setDetailsSheetIndex}
        />

        {isBottomSheetOpen && (
          <BottomSheet
            ref={bottomSheetRef}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            onClose={() => {
              setIsBottomSheetOpen(false);
              setIsLote(false);
              setLoteMinutas([]);
              setLoteFretes([]);
              setMinutaNumero("");
              setFreteNumero("");
            }}
          >
            <BottomSheetView className="flex-1 p-4">
              <ScrollView showsVerticalScrollIndicator={false}>
                <H4 className="mb-4">Lançar Ocorrência</H4>
                {isLote && loteMinutas.length > 0 && (
                  <View className="mb-4">
                    <P className="mb-2 font-bold text-blue-900">
                      Ocorrência em lote para as Minutas/Fretes:
                    </P>
                    <P className="text-xs text-blue-900">
                      {loteMinutas.map(
                        (min, idx) =>
                          ` Minuta: ${min} - Frete: ${loteFretes[idx]} | `,
                      )}
                    </P>
                  </View>
                )}
                <View className="mb-4">
                  <P className="mb-2">Minuta Número:</P>
                  <TextInput
                    className="h-12 rounded-lg border border-gray-300 px-4"
                    value={isLote ? loteMinutas.join(", ") : minutaNumero}
                    editable={false}
                  />
                </View>
                <View className="mb-4">
                  <P className="mb-2">Frete:</P>
                  <TextInput
                    className="h-12 rounded-lg border border-gray-300 px-4"
                    value={isLote ? loteFretes.join(", ") : freteNumero}
                    editable={false}
                  />
                </View>

                <View className="mb-4">
                  <P className="mb-2">Ocorrência:</P>
                  <Pressable
                    className={`h-12 justify-center rounded-lg border px-4`}
                    style={{
                      position: "relative",
                      borderColor: getInputBorderColor(
                        selectedOcorrencia,
                        true,
                      ),
                      borderWidth: 1,
                    }}
                    onPress={() => setIsOcorrenciaSheetOpen(true)}
                  >
                    <P style={{ paddingRight: 32 }}>
                      {selectedOcorrencia || "Selecione uma ocorrência"}
                    </P>
                    <View
                      style={{
                        position: "absolute",
                        right: 12,
                        top: "50%",
                        transform: [{ translateY: -12 }],
                      }}
                    >
                      <ChevronDown />
                    </View>
                  </Pressable>
                </View>

                <View className="mb-4">
                  <P className="mb-2">Data da ocorrência:</P>
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    activeOpacity={0.7}
                  >
                    <TextInput
                      className={`h-12 rounded-lg border px-4`}
                      style={{
                        borderColor: getInputBorderColor(data, true),
                        borderWidth: 1,
                      }}
                      value={data ? data.split("-").reverse().join("/") : ""}
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
                      // Salve no formato YYYY-MM-DD
                      const formatted = date.toISOString().split("T")[0];
                      setData(formatted);
                    }}
                    onCancel={() => setShowDatePicker(false)}
                    initialDate={
                      data
                        ? (() => {
                            // data está em YYYY-MM-DD
                            const [y, m, d] = data.split("-");
                            return new Date(`${y}-${m}-${d}`);
                          })()
                        : undefined
                    }
                  />
                </View>

                <View className="mb-4">
                  <P className="mb-2">Hora da ocorrência:</P>
                  <TouchableOpacity
                    onPress={() => setShowTimePicker(true)}
                    activeOpacity={0.7}
                  >
                    <TextInput
                      className={`h-12 rounded-lg border px-4`}
                      style={{
                        borderColor: getInputBorderColor(hora, true),
                        borderWidth: 1,
                      }}
                      value={hora}
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
                      // Formatar para HH:MM
                      const formatted = date.toTimeString().slice(0, 5);
                      setHora(formatted);
                    }}
                    onCancel={() => setShowTimePicker(false)}
                    initialDate={
                      hora
                        ? (() => {
                            const [h, m] = hora.split(":");
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

                <View className="flex-row justify-end gap-2">
                  <Button
                    style={{
                      backgroundColor: isFormValid ? "#1e3a8a" : "#a5a5d6",
                      borderRadius: 4,
                      width: 110,
                      height: 36,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onPress={isFormValid ? handleSalvarOcorrencia : undefined}
                    disabled={!isFormValid}
                  >
                    <P
                      style={{
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: 16,
                      }}
                    >
                      SALVAR
                    </P>
                  </Button>
                  <BackButton
                    style={{
                      backgroundColor: "#1e3a8a",
                      borderRadius: 4,
                      width: 110,
                      height: 36,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onPress={() => {
                      bottomSheetRef.current?.close();
                      setIsBottomSheetOpen(false);
                    }}
                  >
                    <P
                      style={{
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: 16,
                      }}
                    >
                      VOLTAR
                    </P>
                  </BackButton>
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
                      setSelectedOcorrencia(
                        ocorrencia as
                          | "despacho cancelado"
                          | "em transito para despacho"
                          | "despacho realizado"
                          | "",
                      );
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

        {/* Modal de confirmação de exclusão */}
        <CustomModal
          visible={!!deleteModal}
          onClose={() => setDeleteModal(null)}
        >
          <View style={{ gap: 12 }}>
            <H4 style={{ color: "#222", textAlign: "center", marginBottom: 8 }}>
              Excluir Ocorrência
            </H4>
            <View style={{ gap: 8 }}>
              <P>Documento:</P>
              <TextInput
                value={deleteModal?.documento?.toString() || ""}
                editable={false}
                className="h-12 rounded-lg border border-gray-300 px-4"
              />
              <P>Ocorrência:</P>
              <TextInput
                value={deleteModal?.ocorrencia || ""}
                editable={false}
                className="h-12 rounded-lg border border-gray-300 px-4"
              />
              <P>Data Ocorrência:</P>
              <TextInput
                value={deleteModal?.data || ""}
                editable={false}
                className="h-12 rounded-lg border border-gray-300 px-4"
              />
              <P>Hora Ocorrência:</P>
              <TextInput
                value={deleteModal?.hora || ""}
                editable={false}
                className="h-12 rounded-lg border border-gray-300 px-4"
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                gap: 12,
                marginTop: 16,
              }}
            >
              <Button
                onPress={() => handleDeleteOcorrencia(deleteModal?.id!)}
                style={{
                  backgroundColor: "#a5a5d6",
                  borderRadius: 4,
                  width: 80,
                  height: 36,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <P style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
                  SIM
                </P>
              </Button>
              <Button
                onPress={() => setDeleteModal(null)}
                style={{
                  backgroundColor: "#1e3a8a",
                  borderRadius: 4,
                  width: 80,
                  height: 36,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <P style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
                  NÃO
                </P>
              </Button>
            </View>
          </View>
        </CustomModal>
      </View>
    </ContainerAppCpX>
  );
}
