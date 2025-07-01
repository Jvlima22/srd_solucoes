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
  getInfoTransferencia,
  getDetalhesTransferencia,
  updateOcorrenciaTransferencia,
  deleteOcorrenciaTransferencia,
} from "@/service/services";
import { controlarBotaoOcorrencia, converterTipoMovimento } from "@/lib/utils";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useRoute, RouteProp } from "@react-navigation/native";
import { Check, ChevronDown, Trash2 } from "lucide-react-native";
import { DetailsBottomSheet } from "@/components/DetailsBottomSheet";
import type { DetalhesTransferenciaDTO } from "../../@types/detalhesTransferenciaDTO";
import { CustomDateTimePicker } from "@components/DateTimePickerModal";
import { BackButton } from "@components/BackButton";
import {
  GenericListCard,
  GenericListCardConfigs,
} from "@components/GenericListCard";
import { CustomModal } from "@components/CustomModal";

type TransferScreenParams = {
  manifestoId: string;
};

type TransferScreenRouteProp = RouteProp<
  { params: TransferScreenParams },
  "params"
>;

// Função utilitária para cor da borda dos campos obrigatórios
function getInputBorderColor(
  value: string | number | null | undefined,
  obrigatorio: boolean,
) {
  return obrigatorio && !value ? "#ef4444" : "#d1d5db"; // red-500 ou gray-300
}

export function TransferScreen() {
  const route = useRoute<TransferScreenRouteProp>();
  const manifestoId = route.params?.manifestoId;
  const [entregas, setEntregas] = useState<transferenciaDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<transferenciaDTO | null>(
    null,
  );

  // Estados para o lançamento de ocorrência
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [selectedOcorrencia, setSelectedOcorrencia] = useState<
    | "transferencia cancelada"
    | "transferencia realizada"
    | "em transito para unidade de destino"
    | ""
  >("");
  const [isOcorrenciaSheetOpen, setIsOcorrenciaSheetOpen] = useState(false);
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [observacao, setObservacao] = useState("");
  const [minutaNumero, setMinutaNumero] = useState("");
  const snapPoints = useMemo(() => ["25%", "50%", "100%"], []);

  const ocorrencias = [
    "transferencia cancelada",
    "transferencia realizada",
    "em transito para unidade de destino",
  ];

  const [selectedDocumentos, setSelectedDocumentos] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  // Para ocorrência em lote
  const [loteTransferencias, setLoteTransferencias] = useState<string[]>([]);
  const [loteFretes, setLoteFretes] = useState<string[]>([]);
  const [isLote, setIsLote] = useState(false);

  // Estados para o picker de data/hora
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Estados para o BottomSheet de detalhes
  const [isDetailsSheetOpen, setIsDetailsSheetOpen] = useState(false);
  const detailsBottomSheetRef = useRef<BottomSheet>(null);
  const [detalhesTransferencia, setDetalhesTransferencia] = useState<
    DetalhesTransferenciaDTO[] | null
  >(null);
  const [detalhesLoading, setDetalhesLoading] = useState(false);
  const [detailsSheetIndex, setDetailsSheetIndex] = useState(-1);

  // Estado para modal de exclusão
  const [deleteModal, setDeleteModal] = useState<null | {
    id: number;
    documento: number;
    ocorrencia: string;
    data: string;
    hora: string;
  }>(null);

  // Calcular se pode excluir ocorrência baseado no tipo_acao do item selecionado
  const podeExcluirOcorrencia = useMemo(() => {
    if (!selectedItem) return false;
    const tipoMovimento = converterTipoMovimento("transfer");
    const tipoAcao = selectedItem.tipo_acao;
    return controlarBotaoOcorrencia(tipoMovimento, tipoAcao);
  }, [selectedItem]);

  // Função para validar se todos os campos obrigatórios estão preenchidos
  const isFormValid = useMemo(() => {
    // Campos obrigatórios: ocorrência, data e hora
    return selectedOcorrencia && data && hora;
  }, [selectedOcorrencia, data, hora]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getInfoTransferencia(manifestoId);
      setEntregas(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [manifestoId]);

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
    setSelectedItem(item);
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
        for (let i = 0; i < loteTransferencias.length; i++) {
          await updateOcorrenciaTransferencia(
            Number(loteTransferencias[i]),
            Number(loteFretes[i]),
            {
              data_ocorrencia: data,
              hora_ocorrencia: hora,
              observacao: observacao,
              ocorrencia: selectedOcorrencia,
            },
          );
        }
      } else {
        // Para ocorrência individual, precisamos do freteId do item selecionado
        const selectedItem = entregas.find(
          (item) => String(item.transferencia) === minutaNumero,
        );

        if (!selectedItem) {
          alert("Item não encontrado");
          return;
        }

        await updateOcorrenciaTransferencia(
          Number(minutaNumero),
          selectedItem.frete,
          {
            data_ocorrencia: data,
            hora_ocorrencia: hora,
            observacao: observacao,
            ocorrencia: selectedOcorrencia,
          },
        );
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

  const handleOpenDetalhes = async (item: transferenciaDTO) => {
    setSelectedItem(item);
    setIsDetailsSheetOpen(true);
    setDetailsSheetIndex(1);
    setDetalhesLoading(true);
    setDetalhesTransferencia(null);
    try {
      const response = await getDetalhesTransferencia(
        String(item.transferencia),
        String(item.frete),
      );
      // Ajuste: se vier response.data.detalhes, use esse array
      const detalhes = Array.isArray(response.data.detalhes)
        ? response.data.detalhes
        : response.data?.detalhes
          ? [response.data.detalhes]
          : [];
      setDetalhesTransferencia(detalhes);
    } catch {
      alert("Não foi possível carregar os detalhes da transferência.");
      setDetailsSheetIndex(-1);
    } finally {
      setDetalhesLoading(false);
    }
  };

  // Função para excluir ocorrência
  const handleDeleteOcorrencia = async (ocorrenciaId: number) => {
    try {
      // Confirmação antes de excluir
      const confirmed = await new Promise<boolean>((resolve) => {
        Alert.alert(
          "Confirmar Exclusão",
          "Tem certeza que deseja excluir esta ocorrência?",
          [
            {
              text: "Cancelar",
              style: "cancel",
              onPress: () => resolve(false),
            },
            {
              text: "Excluir",
              style: "destructive",
              onPress: () => resolve(true),
            },
          ],
        );
      });

      if (!confirmed) return;

      // Chama a API para excluir
      await deleteOcorrenciaTransferencia(ocorrenciaId.toString());

      // Recarrega os detalhes da transferência
      if (selectedItem) {
        const response = await getDetalhesTransferencia(
          String(selectedItem.transferencia),
          String(selectedItem.frete),
        );
        const detalhes = Array.isArray(response.data.detalhes)
          ? response.data.detalhes
          : response.data?.detalhes
            ? [response.data.detalhes]
            : [];
        setDetalhesTransferencia(detalhes);
      }
      await fetchData();
      Alert.alert("Sucesso", "Ocorrência excluída com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir ocorrência:", error);
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

        <GenericListCard
          data={entregas}
          config={GenericListCardConfigs.transfer}
          refreshing={refreshing}
          onRefresh={onRefresh}
          selectedItems={selectedDocumentos}
          setSelectedItems={setSelectedDocumentos}
          onOpenDetails={(item) => handleOpenDetalhes(item as transferenciaDTO)}
          onLancarOcorrencia={(item) =>
            handleLancarOcorrencia(item as transferenciaDTO)
          }
        />

        <DetailsBottomSheet
          isOpen={isDetailsSheetOpen}
          onClose={() => {
            setIsDetailsSheetOpen(false);
            setDetailsSheetIndex(-1);
          }}
          bottomSheetRef={detailsBottomSheetRef}
          title="Detalhes da transferência"
          primaryFields={[
            {
              label: "Número da Transferência",
              value: selectedItem?.transferencia || "",
            },
            {
              label: "Frete",
              value: selectedItem?.frete || "",
            },
          ]}
          columns={[
            { header: "Documento", accessor: "documento", flex: 1.5 },
            { header: "Ocorrência", accessor: "ocorrencia", flex: 2 },
            {
              header: "Data",
              accessor: "data",
              flex: 1.5,
              render: (item) => (
                <P style={{ textAlign: "center", color: "#222" }}>
                  {/* Aceita data em formato YYYY-MM-DD ou DD/MM/YYYY */}
                  {item.data
                    ? /\d{4}-\d{2}-\d{2}/.test(item.data)
                      ? item.data.split("-").reverse().join("/")
                      : item.data
                    : ""}
                </P>
              ),
            },
            {
              header: "Hora",
              accessor: "hora",
              flex: 1,
              render: (item) => (
                <P style={{ textAlign: "center", color: "#222" }}>
                  {item.hora ? item.hora.substring(0, 5) : "N/A"}
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
          data={
            Array.isArray(detalhesTransferencia)
              ? detalhesTransferencia
              : detalhesTransferencia
                ? [detalhesTransferencia]
                : []
          }
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
                    value={
                      isLote
                        ? loteFretes.join(", ")
                        : selectedItem?.frete?.toString() || ""
                    }
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
                          | "transferencia cancelada"
                          | "transferencia realizada"
                          | "em transito para unidade de destino"
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
                value={
                  deleteModal?.data
                    ? deleteModal.data.split("-").reverse().join("/")
                    : ""
                }
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
