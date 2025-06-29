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
import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  getInfoColeta,
  updateOcorrenciaColeta,
  getDetalhesColeta,
  deleteOcorrenciaColeta,
} from "@/service/services";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useRoute, RouteProp } from "@react-navigation/native";
import { ChevronDown, Trash2 } from "lucide-react-native";
import { DetailsBottomSheet } from "@/components/DetailsBottomSheet";
import { CustomDateTimePicker } from "@components/DateTimePickerModal";
import { BackButton } from "@components/BackButton";
import {
  GenericListCard,
  GenericListCardConfigs,
} from "@components/GenericListCard";
import * as DocumentPicker from "expo-document-picker";
import { Portal } from "@rn-primitives/portal";
import { CustomModal } from "@components/CustomModal";

type CollectionScreenParams = {
  manifestoId: string;
};

type CollectionScreenRouteProp = RouteProp<
  { params: CollectionScreenParams },
  "params"
>;

interface DetalhesColetaDTO {
  "Numero da coleta": number;
  ocorrencias: {
    id: number;
    documentos: string;
    nome_ocorrencia: string;
    data_ocorrencia: string;
    hora_ocorrencia: string;
  }[];
}

export function CollectionScreen() {
  const route = useRoute<CollectionScreenRouteProp>();
  const manifestoId = route.params?.manifestoId;
  const [entregas, setEntregas] = useState<coletaDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<coletaDTO | null>(null);
  const [selectedColetas, setSelectedColetas] = useState<string[]>([]);

  // Estados para o picker de data/hora
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Estados para o lançamento de ocorrência
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [selectedOcorrencia, setSelectedOcorrencia] = useState("");
  const [isOcorrenciaSheetOpen, setIsOcorrenciaSheetOpen] = useState(false);
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [observacao, setObservacao] = useState("");
  const [coletaNumero, setColetaNumero] = useState("");
  const [recebedor, setRecebedor] = useState("");
  const [documentoRecebedor, setDocumentoRecebedor] = useState("");
  const [idTipoRecebedor, setIdTipoRecebedor] = useState<number | null>(null);
  const [isTipoRecebedorSheetOpen, setIsTipoRecebedorSheetOpen] =
    useState(false);

  // Estados para o BottomSheet de detalhes
  const [isDetailsSheetOpen, setIsDetailsSheetOpen] = useState(false);
  const detailsBottomSheetRef = useRef<BottomSheet>(null);
  const [detalhesColeta, setDetalhesColeta] =
    useState<DetalhesColetaDTO | null>(null);
  const [detalhesLoading, setDetalhesLoading] = useState(false);
  const [detailsSheetIndex, setDetailsSheetIndex] = useState(-1);

  // Estado para o comprovante
  const [comprovante, setComprovante] = useState<any>(null);

  // Estado para modal de exclusão
  const [deleteModal, setDeleteModal] = useState<null | {
    id: number;
    documentos: string;
    nome_ocorrencia: string;
    data_ocorrencia: string;
    hora_ocorrencia: string;
  }>(null);

  const ocorrencias = [
    "Coleta cancelada",
    "Em transito para coleta",
    "Coleta realizado normalmente",
  ];

  const tipoRecebedorOptions = [
    { id: 1, nome: "O PRÓPRIO" },
    { id: 2, nome: "FAMÍLIA" },
    { id: 3, nome: "VIZINHO" },
    { id: 4, nome: "PORTEIRO" },
  ];

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getInfoColeta(manifestoId);
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

  // Função para selecionar arquivo
  const handleSelectFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setComprovante({
          uri: file.uri,
          name: file.name,
          type: file.mimeType,
          size: file.size,
        });
      }
    } catch (error) {
      console.error("Erro ao selecionar arquivo:", error);
      alert("Erro ao selecionar arquivo. Tente novamente.");
    }
  };

  const handleSalvarOcorrencia = async () => {
    try {
      if (!selectedOcorrencia || !data || !hora) {
        alert("Por favor, preencha todos os campos obrigatórios");
        return;
      }

      // Validação adicional para "Coleta realizado normalmente"
      if (selectedOcorrencia === "Coleta realizado normalmente") {
        if (
          !recebedor ||
          !documentoRecebedor ||
          !idTipoRecebedor ||
          !comprovante
        ) {
          alert(
            "Para 'Coleta realizado normalmente' todos os campos obrigatórios devem ser preenchidos e o comprovante enviado.",
          );
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

          await updateOcorrenciaColeta(Number(coletaNumero), formData);
        } else {
          await updateOcorrenciaColeta(Number(coletaNumero), payload);
        }
      } else {
        await updateOcorrenciaColeta(Number(coletaNumero), payload);
      }

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
      setRecebedor("");
      setDocumentoRecebedor("");
      setIdTipoRecebedor(null);
      setComprovante(null);

      alert("Ocorrência salva com sucesso!");
    } catch (error) {
      console.error("Error saving ocorrencia:", error);
      alert("Erro ao salvar ocorrência. Por favor, tente novamente.");
    }
  };

  const handleOpenDetalhes = async (item: coletaDTO) => {
    setSelectedItem(item);
    setIsDetailsSheetOpen(true);
    setDetailsSheetIndex(1);
    setDetalhesLoading(true);
    setDetalhesColeta(null);
    try {
      const response = await getDetalhesColeta(String(item.coleta));
      setDetalhesColeta(response.data);
    } catch {
      alert("Não foi possível carregar os detalhes da coleta.");
      setDetailsSheetIndex(-1);
    } finally {
      setDetalhesLoading(false);
    }
  };

  // Função para excluir ocorrência
  const handleDeleteOcorrencia = async (ocorrenciaId: number) => {
    try {
      await deleteOcorrenciaColeta(ocorrenciaId.toString());
      if (selectedItem) {
        const response = await getDetalhesColeta(String(selectedItem.coleta));
        setDetalhesColeta(response.data);
      }
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

  // Expandir automaticamente quando "Coleta realizado normalmente" é selecionado
  useEffect(() => {
    if (
      selectedOcorrencia === "Coleta realizado normalmente" &&
      isBottomSheetOpen
    ) {
      bottomSheetRef.current?.expand();
    }
  }, [selectedOcorrencia, isBottomSheetOpen]);

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
        <H4>Relação de Coleta</H4>

        <GenericListCard
          data={entregas}
          config={GenericListCardConfigs.coleta}
          refreshing={refreshing}
          onRefresh={onRefresh}
          selectedItems={selectedColetas}
          setSelectedItems={setSelectedColetas}
          onOpenDetails={(item) => handleOpenDetalhes(item as coletaDTO)}
          onLancarOcorrencia={(item) =>
            handleLancarOcorrencia(item as coletaDTO)
          }
        />

        {isBottomSheetOpen && (
          <BottomSheet
            ref={bottomSheetRef}
            snapPoints={["25%", "75%", "100%"]}
            enablePanDownToClose={true}
            onClose={() => setIsBottomSheetOpen(false)}
            index={
              selectedOcorrencia === "Coleta realizado normalmente" ? 2 : 1
            }
          >
            <BottomSheetView className="flex-1 p-4">
              <ScrollView
                showsVerticalScrollIndicator={true}
                contentContainerStyle={{ paddingBottom: 50 }}
                style={{ flex: 1 }}
              >
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
                    style={{ position: "relative" }}
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
                      className="h-12 rounded-lg border border-gray-300 px-4"
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
                      className="h-12 rounded-lg border border-gray-300 px-4"
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

                {selectedOcorrencia === "Coleta realizado normalmente" && (
                  <>
                    <View className="mb-4">
                      <P className="mb-2">Recebedor:</P>
                      <TextInput
                        className="h-12 rounded-lg border border-gray-300 px-4"
                        value={recebedor}
                        onChangeText={setRecebedor}
                        placeholder="Digite o nome do recebedor"
                      />
                    </View>
                    <View className="mb-4">
                      <P className="mb-2">Documento do Recebedor:</P>
                      <TextInput
                        className="h-12 rounded-lg border border-gray-300 px-4"
                        value={documentoRecebedor}
                        onChangeText={setDocumentoRecebedor}
                        placeholder="Digite o documento do recebedor"
                      />
                    </View>
                    <View className="mb-4">
                      <P className="mb-2">Tipo de Recebedor:</P>
                      <Pressable
                        className="h-12 justify-center rounded-lg border border-gray-300 px-4"
                        style={{ position: "relative" }}
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
                    <View className="mb-4">
                      <P className="mb-2">Comprovante:</P>
                      <View className="mb-4 flex-row items-center">
                        <Pressable
                          onPress={handleSelectFile}
                          style={{
                            borderWidth: 2,
                            borderColor: "red",
                            backgroundColor: "#f5f5f5",
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            borderRadius: 4,
                            marginRight: 8,
                          }}
                        >
                          <P style={{ color: "#222", fontWeight: "bold" }}>
                            Escolher Ficheiros
                          </P>
                        </Pressable>
                        <P style={{ color: "#222" }}>
                          {comprovante
                            ? comprovante.name
                            : "Nenhum ficheiro selecionado"}
                        </P>
                      </View>
                    </View>
                  </>
                )}

                <View className="flex-row justify-between gap-4">
                  <BackButton
                    className="flex-1"
                    onPress={() => {
                      bottomSheetRef.current?.close();
                      setIsBottomSheetOpen(false);
                    }}
                  >
                    <P className="text-white">Voltar</P>
                  </BackButton>
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

        <DetailsBottomSheet
          isOpen={isDetailsSheetOpen}
          onClose={() => {
            setIsDetailsSheetOpen(false);
            setDetailsSheetIndex(-1);
          }}
          bottomSheetRef={detailsBottomSheetRef}
          title="Detalhes da coleta"
          primaryFields={[
            {
              label: "Número da Coleta",
              value:
                detalhesColeta?.["Numero da coleta"] ||
                selectedItem?.coleta ||
                "",
            },
          ]}
          columns={[
            { header: "Doc N°", accessor: "documentos", flex: 1 },
            { header: "Ocorrência", accessor: "nome_ocorrencia", flex: 2 },
            {
              header: "Data",
              accessor: "data_ocorrencia",
              flex: 1.5,
              render: (item) => (
                <P style={{ textAlign: "center", color: "#222" }}>
                  {item.data_ocorrencia || "N/A"}
                </P>
              ),
            },
            {
              header: "Hora",
              accessor: "hora_ocorrencia",
              flex: 1,
              render: (item) => (
                <P style={{ textAlign: "center", color: "#222" }}>
                  {item.hora_ocorrencia || "N/A"}
                </P>
              ),
            },
            {
              header: "Excluir",
              accessor: "actions",
              flex: 1,
              render: (item) => (
                <TouchableOpacity
                  onPress={() =>
                    setDeleteModal({
                      id: item.id,
                      documentos: item.documentos,
                      nome_ocorrencia: item.nome_ocorrencia,
                      data_ocorrencia: item.data_ocorrencia,
                      hora_ocorrencia: item.hora_ocorrencia,
                    })
                  }
                >
                  <Trash2 width={18} height={18} color="#ff0000" />
                </TouchableOpacity>
              ),
            },
          ]}
          data={detalhesColeta?.ocorrencias || []}
          isLoading={detalhesLoading}
          sheetIndex={detailsSheetIndex}
          setSheetIndex={setDetailsSheetIndex}
        />

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
                value={deleteModal?.documentos || ""}
                editable={false}
                className="h-12 rounded-lg border border-gray-300 px-4"
              />
              <P>Ocorrência:</P>
              <TextInput
                value={deleteModal?.nome_ocorrencia || ""}
                editable={false}
                className="h-12 rounded-lg border border-gray-300 px-4"
              />
              <P>Data Ocorrência:</P>
              <TextInput
                value={deleteModal?.data_ocorrencia || ""}
                editable={false}
                className="h-12 rounded-lg border border-gray-300 px-4"
              />
              <P>Hora Ocorrência:</P>
              <TextInput
                value={deleteModal?.hora_ocorrencia || ""}
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
