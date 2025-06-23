import { Button } from "@components/Button";
import { ContainerAppCpX } from "@components/ContainerAppCpX";
import { H4, P } from "@components/Typography";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  getInfoColeta,
  updateOcorrenciaColeta,
  getDetalhesColeta,
} from "@/service/services";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import MaskInput from "react-native-mask-input";
import { useRoute, RouteProp } from "@react-navigation/native";
import { ChevronDown, Trash2 } from "lucide-react-native";
import { DetailsBottomSheet } from "@/components/DetailsBottomSheet";
import { CustomDateTimePicker } from "@components/DateTimePickerModal";

type CollectionScreenParams = {
  manifestoId: string;
};

type CollectionScreenRouteProp = RouteProp<
  { params: CollectionScreenParams },
  "params"
>;

interface DetalhesColetaDTO {
  coleta: number;
  documento: string | null;
  ocorrencia: string;
  dataOcorrencia: string | null;
  horaOcorrencia: string | null;
}

export function CollectionScreen() {
  const route = useRoute<CollectionScreenRouteProp>();
  const manifestoId = route.params?.manifestoId;
  const [entregas, setEntregas] = useState<coletaDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<coletaDTO | null>(null);

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
  const [expedidor, setExpedidor] = useState("");
  const [documento, setDocumento] = useState("");
  const [arquivo, setArquivo] = useState<string | null>(null);

  // Estados para o BottomSheet de detalhes
  const [isDetailsSheetOpen, setIsDetailsSheetOpen] = useState(false);
  const detailsBottomSheetRef = useRef<BottomSheet>(null);
  const [detalhesColeta, setDetalhesColeta] = useState<
    DetalhesColetaDTO[] | null
  >(null);
  const [detalhesLoading, setDetalhesLoading] = useState(false);
  const [detailsSheetIndex, setDetailsSheetIndex] = useState(-1);

  const ocorrencias = [
    "coleta cancelada",
    "Filial",
    "Coleta realizado normalmente",
  ];

  // Função para formatar a hora para HH:MM
  const formatarHora = (hora: string | null): string => {
    if (!hora) return "N/A";

    // Se a hora já está no formato HH:MM, retorna como está
    if (hora.length === 5 && hora.includes(":")) {
      return hora;
    }

    // Se a hora está no formato HH:MM:SS, remove os segundos
    if (hora.length === 8 && hora.includes(":")) {
      return hora.substring(0, 5);
    }

    return hora;
  };

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

  const handleOpenDetalhes = async (item: coletaDTO) => {
    console.log("Abrindo detalhes", item);
    setSelectedItem(item);
    setIsDetailsSheetOpen(true);
    setDetailsSheetIndex(1);
    setDetalhesLoading(true);
    setDetalhesColeta(null);
    try {
      const response = await getDetalhesColeta(String(item.coleta));
      setDetalhesColeta(response.data);
    } catch (error) {
      alert("Não foi possível carregar os detalhes da coleta.");
      setDetailsSheetIndex(-1);
    } finally {
      setDetalhesLoading(false);
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
                    <P className="text-sm font-bold">Coleta - {item.coleta}</P>
                  </View>

                  <View className="flex-row items-center gap-3">
                    <P className="text-sm font-bold">
                      Total Documento - {item.totalDocumento}
                    </P>
                  </View>

                  <View className="flex-row items-center gap-3">
                    <P className="text-sm">Volume - {item.volume}</P>
                  </View>

                  <View className="flex-row items-center gap-3">
                    <P className="text-sm">Peso - {item.peso} kg</P>
                  </View>

                  <View className="flex-row items-center gap-3">
                    <P className="text-sm">Local - {item.destinatario}</P>
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
                </View>

                <View className="mt-5 items-center justify-center">
                  <Button
                    size="icon"
                    className="w-1/3"
                    onPress={() => handleOpenDetalhes(item)}
                  >
                    <P className="text-base font-bold text-white">Detalhes</P>
                  </Button>
                </View>

                <View className="mt-3 items-center justify-center">
                  <Button
                    className="w-1/2"
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
                      value={data}
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
                      // Formatar para DD/MM/AAAA
                      const formatted = date
                        .toISOString()
                        .split("T")[0]
                        .split("-")
                        .reverse()
                        .join("/");
                      setData(formatted);
                    }}
                    onCancel={() => setShowDatePicker(false)}
                    initialDate={
                      data
                        ? (() => {
                            const [d, m, y] = data.split("/");
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

        <DetailsBottomSheet
          isOpen={isDetailsSheetOpen}
          onClose={() => {
            setIsDetailsSheetOpen(false);
            setDetalhesColeta(null);
            setDetailsSheetIndex(-1);
          }}
          bottomSheetRef={detailsBottomSheetRef}
          title="Detalhes da coleta"
          primaryFields={[
            {
              label: "Número da Coleta",
              value: selectedItem?.coleta || "",
            },
            {
              label: "Documento",
              value: selectedItem?.totalDocumento || "",
            },
          ]}
          columns={[
            { header: "Doc N°", accessor: "documento", flex: 1 },
            { header: "Ocorrência", accessor: "ocorrencia", flex: 2 },
            {
              header: "Data",
              accessor: "data",
              flex: 1.5,
              render: (item) => (
                <P style={{ textAlign: "center", color: "#222" }}>
                  {item.data
                    ? new Date(item.data).toLocaleDateString("pt-BR")
                    : "N/A"}
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
              render: () => (
                <TouchableOpacity>
                  <Trash2 width={18} height={18} color="#ff0000" />
                </TouchableOpacity>
              ),
            },
          ]}
          data={
            Array.isArray(detalhesColeta)
              ? detalhesColeta
              : detalhesColeta
                ? [detalhesColeta]
                : []
          }
          isLoading={detalhesLoading}
          sheetIndex={detailsSheetIndex}
          setSheetIndex={setDetailsSheetIndex}
        />
      </View>
    </ContainerAppCpX>
  );
}
