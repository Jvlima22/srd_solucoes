import { Button } from "@components/Button";
import { ContainerAppCpX } from "@components/ContainerAppCpX";
import { H4, P } from "@components/Typography";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";
import {
  getInfoEntrega,
  getDetalhesEntrega,
  updateOcorrenciaEntrega,
  deleteOcorrenciaEntrega,
} from "@/service/services";
import { controlarBotaoOcorrencia, converterTipoMovimento } from "@/lib/utils";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { Check, ChevronDown, Trash2 } from "lucide-react-native";
import { DetailsBottomSheet } from "@/components/DetailsBottomSheet";
import { CustomDateTimePicker } from "@components/DateTimePickerModal";
import { BackButton } from "@components/BackButton";
import {
  GenericListCard,
  GenericListCardConfigs,
} from "@components/GenericListCard";
import { CustomModal } from "@components/CustomModal";
import { FileUpload } from "@components/FileUpload";

type DeliveryScreenParams = {
  manifestoId: string;
};

type DeliveryScreenRouteProp = RouteProp<
  { params: DeliveryScreenParams },
  "params"
>;

// Função utilitária para cor da borda dos campos obrigatórios
function getInputBorderColor(
  value: string | number | null | undefined,
  obrigatorio: boolean,
) {
  return obrigatorio && !value ? "#ef4444" : "#d1d5db"; // red-500 ou gray-300
}

export function DeliveryScreen() {
  const navigation = useNavigation();
  const route = useRoute<DeliveryScreenRouteProp>();
  const manifestoId = route.params?.manifestoId;
  const [entregas, setEntregas] = useState<deliveryDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<deliveryDTO | null>(null);
  const [ocorrenciaData, setOcorrenciaData] = useState<{
    id: number;
    ocorrencia: string;
    data_ocorrencia: string;
    hora_ocorrencia: string;
    observacao: string;
  } | null>(null);
  const [detalhesEntrega, setDetalhesEntrega] =
    useState<DetalhesEntregaDTO | null>(null);
  const [detalhesLoading, setDetalhesLoading] = useState(false);

  // Bottom Sheet
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [documento, setDocumento] = useState("");
  const [frete, setFrete] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [observacao, setObservacao] = useState("");
  const [selectedOcorrencia, setSelectedOcorrencia] = useState<
    | "Aguardado no local"
    | "Cliente recusou a entrega"
    | "Entrega cancelada pelo cliente"
    | "Entrega realizado normalmente"
    | "Em transito para entrega"
    | ""
  >("");
  const [isOcorrenciaSheetOpen, setIsOcorrenciaSheetOpen] = useState(false);
  const [selectedDocumentos, setSelectedDocumentos] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Novo estado para lote
  const [loteDocs, setLoteDocs] = useState<string[]>([]);
  const [loteFretes, setLoteFretes] = useState<string[]>([]);
  const [isLote, setIsLote] = useState(false);

  // Estados para o BottomSheet de detalhes
  const [isDetailsSheetOpen, setIsDetailsSheetOpen] = useState(false);
  const detailsBottomSheetRef = useRef<BottomSheet>(null);
  const [detailsSheetIndex, setDetailsSheetIndex] = useState(-1);

  // Estados para o picker de data/hora
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Estado para modal de exclusão
  const [deleteModal, setDeleteModal] = useState<null | {
    id: number;
    numero: number;
    ocorrencia: string;
    data: string;
    hora: string;
  }>(null);

  // Calcular se pode excluir ocorrência baseado no tipo_acao do item selecionado
  const podeExcluirOcorrencia = useMemo(() => {
    if (!selectedItem) return false;
    const tipoMovimento = converterTipoMovimento("delivery");
    const tipoAcao = selectedItem.tipo_acao;
    return controlarBotaoOcorrencia(tipoMovimento, tipoAcao);
  }, [selectedItem]);

  const [recebedor, setRecebedor] = useState("");
  const [documentoRecebedor, setDocumentoRecebedor] = useState("");
  const [idTipoRecebedor, setIdTipoRecebedor] = useState<number | null>(null);
  const [isTipoRecebedorSheetOpen, setIsTipoRecebedorSheetOpen] =
    useState(false);
  const tipoRecebedorOptions = [
    { id: 1, nome: "O PRÓPRIO" },
    { id: 2, nome: "FAMÍLIA" },
    { id: 3, nome: "VIZINHO" },
    { id: 4, nome: "PORTEIRO" },
  ];

  // Estado para o comprovante
  const [comprovante, setComprovante] = useState<any>(null);

  const ocorrencias = [
    "Aguardado no local",
    "Cliente recusou a entrega",
    "Em transito para entrega",
    "Entrega cancelada pelo cliente",
    "Entrega realizado normalmente",
  ];

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getInfoEntrega(manifestoId);
      setEntregas(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [manifestoId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLancarOcorrencia = async (
    documentoId: number,
    freteId: number,
  ) => {
    setDocumento(documentoId.toString());
    setFrete(freteId.toString());
    setIsBottomSheetOpen(true);
    bottomSheetRef.current?.expand();
  };

  // Função para validar se todos os campos obrigatórios estão preenchidos
  const isFormValid = useMemo(() => {
    // Campos obrigatórios básicos
    const basicFieldsValid = selectedOcorrencia && data && hora;

    // Se não são campos básicos válidos, retorna false
    if (!basicFieldsValid) return false;

    // Validação adicional para "Entrega realizado normalmente"
    if (selectedOcorrencia === "Entrega realizado normalmente") {
      return recebedor && documentoRecebedor && idTipoRecebedor && comprovante;
    }

    return true;
  }, [
    selectedOcorrencia,
    data,
    hora,
    recebedor,
    documentoRecebedor,
    idTipoRecebedor,
    comprovante,
  ]);

  const handleSalvarOcorrencia = async () => {
    try {
      if (!selectedOcorrencia || !data || !hora) {
        alert("Por favor, preencha todos os campos obrigatórios");
        return;
      }

      // Validação adicional para "Entrega realizado normalmente"
      if (selectedOcorrencia === "Entrega realizado normalmente") {
        if (
          !recebedor ||
          !documentoRecebedor ||
          !idTipoRecebedor ||
          !comprovante
        ) {
          alert(
            "Para 'Entrega realizado normalmente' todos os campos obrigatórios devem ser preenchidos e o comprovante enviado.",
          );
          return;
        }
      }

      if (isLote && loteDocs.length > 0) {
        // Lançar ocorrência para todos os documentos/fretes em lote
        for (let i = 0; i < loteDocs.length; i++) {
          const payload: any = {
            data_ocorrencia: data,
            hora_ocorrencia: hora,
            observacao: observacao,
            ocorrencia: selectedOcorrencia,
          };

          // Adiciona campos extras se for "Entrega realizado normalmente"
          if (selectedOcorrencia === "Entrega realizado normalmente") {
            payload.recebedor = recebedor;
            payload.documento_recebedor = documentoRecebedor;
            payload.id_tipo_recebedor = idTipoRecebedor;

            // Criar FormData para enviar o arquivo
            if (comprovante) {
              const formData = new FormData();
              formData.append("comprovante", {
                uri: comprovante.uri,
                name: comprovante.name,
                type: comprovante.type,
              } as any);

              // Adicionar outros campos ao FormData
              Object.keys(payload).forEach((key) => {
                formData.append(key, payload[key]);
              });

              await updateOcorrenciaEntrega(Number(loteFretes[i]), formData);
            } else {
              await updateOcorrenciaEntrega(Number(loteFretes[i]), payload);
            }
          } else {
            await updateOcorrenciaEntrega(Number(loteFretes[i]), payload);
          }
        }
      } else {
        const payload: any = {
          data_ocorrencia: data,
          hora_ocorrencia: hora,
          observacao: observacao,
          ocorrencia: selectedOcorrencia,
        };

        // Adiciona campos extras se for "Entrega realizado normalmente"
        if (selectedOcorrencia === "Entrega realizado normalmente") {
          payload.recebedor = recebedor;
          payload.documento_recebedor = documentoRecebedor;
          payload.id_tipo_recebedor = idTipoRecebedor;

          // Criar FormData para enviar o arquivo
          if (comprovante) {
            const formData = new FormData();
            formData.append("comprovante", {
              uri: comprovante.uri,
              name: comprovante.name,
              type: comprovante.type,
            } as any);

            // Adicionar outros campos ao FormData
            Object.keys(payload).forEach((key) => {
              formData.append(key, payload[key]);
            });

            await updateOcorrenciaEntrega(Number(frete), formData);
          } else {
            await updateOcorrenciaEntrega(Number(frete), payload);
          }
        } else {
          await updateOcorrenciaEntrega(Number(frete), payload);
        }
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
      setRecebedor("");
      setDocumentoRecebedor("");
      setIdTipoRecebedor(null);
      setComprovante(null);
      setIsLote(false);
      setLoteDocs([]);
      setLoteFretes([]);
      alert("Ocorrência salva com sucesso!");
    } catch (error) {
      console.error("Error saving ocorrencia:", error);
      alert("Erro ao salvar ocorrência. Por favor, tente novamente.");
    }
  };

  const handleOpenDetalhes = async (item: deliveryDTO) => {
    setSelectedItem(item);
    setIsDetailsSheetOpen(true);
    setDetailsSheetIndex(1);
    setDetalhesLoading(true);
    setDetalhesEntrega(null);
    try {
      const response = await getDetalhesEntrega(String(item.frete));
      setDetalhesEntrega(response.data);
    } catch {
      alert("Não foi possível carregar os detalhes da entrega.");
      setDetailsSheetIndex(-1);
    } finally {
      setDetalhesLoading(false);
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

  // Função para excluir ocorrência
  const handleDeleteOcorrencia = async (ocorrenciaId: number) => {
    try {
      await deleteOcorrenciaEntrega(ocorrenciaId.toString());
      if (selectedItem) {
        const response = await getDetalhesEntrega(String(selectedItem.frete));
        setDetalhesEntrega(response.data);
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

        <GenericListCard
          data={entregas}
          config={GenericListCardConfigs.delivery}
          refreshing={refreshing}
          onRefresh={fetchData}
          selectedItems={selectedDocumentos}
          setSelectedItems={setSelectedDocumentos}
          onOpenDetails={(item) => handleOpenDetalhes(item as deliveryDTO)}
          onLancarOcorrencia={(item) =>
            handleLancarOcorrencia(
              (item as deliveryDTO).documento,
              (item as deliveryDTO).frete,
            )
          }
        />

        <DetailsBottomSheet
          isOpen={isDetailsSheetOpen}
          onClose={() => {
            setIsDetailsSheetOpen(false);
            setDetailsSheetIndex(-1);
          }}
          bottomSheetRef={detailsBottomSheetRef}
          title="Detalhes da entrega"
          primaryFields={[
            {
              label: "Documento / NF",
              value:
                detalhesEntrega?.documento || selectedItem?.documento || "",
            },
            {
              label: "Frete",
              value: detalhesEntrega?.frete || selectedItem?.frete || "",
            },
          ]}
          columns={[
            { header: "Nº", accessor: "numero", flex: 0.7 },
            { header: "Ocorrência", accessor: "ocorrencia", flex: 2 },
            {
              header: "Data",
              accessor: "data",
              flex: 1.8,
              render: (item) => (
                <P style={{ textAlign: "center", color: "#222" }}>
                  {item.data ? item.data.split("-").reverse().join("/") : ""}
                </P>
              ),
            },
            { header: "Hora", accessor: "hora", flex: 1.1 },
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
                        numero: item.numero,
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
          data={detalhesEntrega?.ocorrencias || []}
          isLoading={detalhesLoading}
          sheetIndex={detailsSheetIndex}
          setSheetIndex={setDetailsSheetIndex}
        />

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
            snapPoints={["25%", "75%", "100%"]}
            enablePanDownToClose={true}
            onClose={() => {
              setIsBottomSheetOpen(false);
              setIsLote(false);
              setLoteDocs([]);
              setLoteFretes([]);
            }}
            index={
              selectedOcorrencia === "Entrega realizado normalmente" ? 2 : 1
            }
          >
            <BottomSheetView className="flex-1 p-4">
              <ScrollView
                showsVerticalScrollIndicator={true}
                contentContainerStyle={{ paddingBottom: 50 }}
                style={{ flex: 1 }}
              >
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
                      const formatted = date.toISOString().split("T")[0];
                      setData(formatted);
                    }}
                    onCancel={() => setShowDatePicker(false)}
                    initialDate={
                      data
                        ? (() => {
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

                {selectedOcorrencia === "Entrega realizado normalmente" && (
                  <>
                    <View className="mb-4">
                      <P className="mb-2">Recebedor:</P>
                      <TextInput
                        className={`h-12 rounded-lg border px-4`}
                        style={{
                          borderColor: getInputBorderColor(recebedor, true),
                          borderWidth: 1,
                        }}
                        value={recebedor}
                        onChangeText={setRecebedor}
                        placeholder="Digite o nome do recebedor"
                      />
                    </View>
                    <View className="mb-4">
                      <P className="mb-2">Documento do Recebedor:</P>
                      <TextInput
                        className={`h-12 rounded-lg border px-4`}
                        style={{
                          borderColor: getInputBorderColor(
                            documentoRecebedor,
                            true,
                          ),
                          borderWidth: 1,
                        }}
                        value={documentoRecebedor}
                        onChangeText={setDocumentoRecebedor}
                        placeholder="Digite o documento do recebedor"
                      />
                    </View>
                    <View className="mb-4">
                      <P className="mb-2">Tipo de Recebedor:</P>
                      <Pressable
                        className={`h-12 justify-center rounded-lg border px-4`}
                        style={{
                          position: "relative",
                          borderColor: getInputBorderColor(
                            idTipoRecebedor,
                            true,
                          ),
                          borderWidth: 1,
                        }}
                        onPress={() => setIsTipoRecebedorSheetOpen(true)}
                      >
                        <P style={{ paddingRight: 32 }}>
                          {idTipoRecebedor
                            ? tipoRecebedorOptions.find(
                                (opt) => opt.id === idTipoRecebedor,
                              )?.nome
                            : "Selecione o tipo de recebedor"}
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
                    <FileUpload
                      onFileSelect={setComprovante}
                      selectedFile={comprovante}
                      isRequired={
                        selectedOcorrencia === "Entrega realizado normalmente"
                      }
                      getInputBorderColor={getInputBorderColor}
                    />
                  </>
                )}

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
                          | "Aguardado no local"
                          | "Cliente recusou a entrega"
                          | "Entrega cancelada pelo cliente"
                          | "Entrega realizado normalmente"
                          | "Em transito para entrega",
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

        {isTipoRecebedorSheetOpen && (
          <BottomSheet
            snapPoints={["50%"]}
            enablePanDownToClose={true}
            onClose={() => setIsTipoRecebedorSheetOpen(false)}
          >
            <BottomSheetView className="flex-1 p-4">
              <H4 className="mb-4">Selecione o Tipo de Recebedor</H4>

              <View className="flex-1">
                {tipoRecebedorOptions.map((opt) => (
                  <Pressable
                    key={opt.id}
                    className="border-b border-gray-200 py-4"
                    onPress={() => {
                      setIdTipoRecebedor(opt.id);
                      setIsTipoRecebedorSheetOpen(false);
                    }}
                  >
                    <P>{opt.nome}</P>
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
              <P>Nº:</P>
              <TextInput
                value={deleteModal?.numero?.toString() || ""}
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
