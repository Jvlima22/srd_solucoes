import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
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
} from "react-native";

import {
  getInfoRetirada,
  updateOcorrenciaRetirada,
  getDetalhesRetirada,
} from "@/service/services";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useRoute, RouteProp } from "@react-navigation/native";
import { Check, ChevronDown, Trash2 } from "lucide-react-native";
import { DetailsBottomSheet } from "@/components/DetailsBottomSheet";
import { CustomDateTimePicker } from "@components/DateTimePickerModal";
import {
  GenericListCard,
  GenericListCardConfigs,
} from "@components/GenericListCard";

type WithdrawalScreenParams = {
  manifestoId: string;
};

type WithdrawalScreenRouteProp = RouteProp<
  { params: WithdrawalScreenParams },
  "params"
>;

export function WithDrawalScreen() {
  const route = useRoute<WithdrawalScreenRouteProp>();
  const manifestoId = route.params?.manifestoId;
  const [retiradas, setRetiradas] = useState<retiradaDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<retiradaDTO | null>(null);

  // Estados para o lançamento de ocorrência
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [selectedOcorrencia, setSelectedOcorrencia] = useState("");
  const [isOcorrenciaSheetOpen, setIsOcorrenciaSheetOpen] = useState(false);
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [observacao, setObservacao] = useState("");
  const [retiradaId, setRetiradaId] = useState("");
  const [selectedDocumentos, setSelectedDocumentos] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  // Para ocorrência em lote
  const [loteIds, setLoteIds] = useState<string[]>([]);
  const [loteFretes, setLoteFretes] = useState<string[]>([]);
  const [isLote, setIsLote] = useState(false);
  const snapPoints = useMemo(() => ["25%", "50%", "100%"], []);

  // Estados para o picker de data/hora
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Estados para o BottomSheet de detalhes
  const [isDetailsSheetOpen, setIsDetailsSheetOpen] = useState(false);
  const detailsBottomSheetRef = useRef<BottomSheet>(null);
  const [detalhesRetirada, setDetalhesRetirada] = useState<any[] | null>(null);
  const [detalhesLoading, setDetalhesLoading] = useState(false);
  const [detailsSheetIndex, setDetailsSheetIndex] = useState(-1);

  const ocorrencias = [
    "Retirada cancelada",
    "Filial",
    "Retirada realizada normalmente",
  ];

  const fetchData = useCallback(async () => {
    if (!manifestoId) return;

    setLoading(true);
    try {
      const response = await getInfoRetirada(manifestoId);
      setRetiradas(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [manifestoId]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await getInfoRetirada(manifestoId);
      setRetiradas(response.data);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleLancarOcorrencia = (item: retiradaDTO) => {
    setRetiradaId(item.retirada.toString());
    setIsBottomSheetOpen(true);
    bottomSheetRef.current?.expand();
  };

  // Selecionar/desmarcar todos
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedDocumentos([]);
      setSelectAll(false);
    } else {
      const allIds = retiradas.map(
        (item) => String(item.retirada) + "-" + item.frete,
      );
      setSelectedDocumentos(allIds);
      setSelectAll(true);
    }
  };

  // GERAR OCORRÊNCIA EM LOTE
  const handleLancarOcorrenciaLote = () => {
    if (selectedDocumentos.length === 0) {
      alert(
        "Selecione pelo menos uma retirada para lançar ocorrência em lote.",
      );
      return;
    }
    // Coletar todos os ids e fretes selecionados
    const ids: string[] = [];
    const fretes: string[] = [];
    selectedDocumentos.forEach((id) => {
      const item = retiradas.find(
        (item) => String(item.retirada) + "-" + item.frete === id,
      );
      if (item) {
        ids.push(String(item.retirada));
        fretes.push(String(item.frete));
      }
    });
    setLoteIds(ids);
    setLoteFretes(fretes);
    setIsLote(true);
    setIsBottomSheetOpen(true);
    bottomSheetRef.current?.expand();
  };

  // Salvar ocorrência (individual ou em lote)
  const handleSalvarOcorrencia = async () => {
    try {
      if (!selectedOcorrencia || !data || !hora) {
        alert("Por favor, preencha todos os campos obrigatórios");
        return;
      }
      if (isLote && loteIds.length > 0) {
        for (let i = 0; i < loteIds.length; i++) {
          await updateOcorrenciaRetirada(Number(loteIds[i]), {
            data_ocorrencia: data,
            hora_ocorrencia: hora,
            observacao: observacao,
            ocorrencia: selectedOcorrencia,
          });
        }
      } else {
        await updateOcorrenciaRetirada(Number(retiradaId), {
          data_ocorrencia: data,
          hora_ocorrencia: hora,
          observacao: observacao,
          ocorrencia: selectedOcorrencia,
        });
      }
      await fetchData();
      bottomSheetRef.current?.close();
      setIsBottomSheetOpen(false);
      setRetiradaId("");
      setData("");
      setHora("");
      setObservacao("");
      setSelectedOcorrencia("");
      setIsLote(false);
      setLoteIds([]);
      setLoteFretes([]);
      alert("Ocorrência salva com sucesso!");
    } catch (error) {
      console.error("Error saving ocorrencia:", error);
      alert("Erro ao salvar ocorrência. Por favor, tente novamente.");
    }
  };

  const handleOpenDetalhes = async (item: retiradaDTO) => {
    console.log("Abrindo detalhes", item);
    setSelectedItem(item);
    setIsDetailsSheetOpen(true);
    setDetailsSheetIndex(1);
    setDetalhesLoading(true);
    setDetalhesRetirada(null);
    try {
      const response = await getDetalhesRetirada(String(item.retirada));
      setDetalhesRetirada(response.data);
    } catch {
      alert("Não foi possível carregar os detalhes da retirada.");
      setDetailsSheetIndex(-1);
    } finally {
      setDetalhesLoading(false);
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
        <H4>Relação de Retirada</H4>

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
          data={retiradas}
          config={GenericListCardConfigs.withdrawal}
          refreshing={refreshing}
          onRefresh={onRefresh}
          selectedItems={selectedDocumentos}
          setSelectedItems={setSelectedDocumentos}
          onOpenDetails={(item) => handleOpenDetalhes(item as retiradaDTO)}
          onLancarOcorrencia={(item) =>
            handleLancarOcorrencia(item as retiradaDTO)
          }
        />

        <DetailsBottomSheet
          isOpen={isDetailsSheetOpen}
          onClose={() => {
            setIsDetailsSheetOpen(false);
            setDetalhesRetirada(null);
            setDetailsSheetIndex(-1);
          }}
          bottomSheetRef={detailsBottomSheetRef}
          title="Detalhes da retirada"
          primaryFields={[
            {
              label: "Romaneio de Retirada",
              value:
                (detalhesRetirada &&
                  detalhesRetirada[0]?.["Romaneio de retirada"]) ||
                selectedItem?.retirada ||
                "",
            },
            {
              label: "Frete",
              value:
                (detalhesRetirada && detalhesRetirada[0]?.frete) ||
                selectedItem?.frete ||
                "",
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
                  {item.data ? item.data : "N/A"}
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
            Array.isArray(detalhesRetirada)
              ? detalhesRetirada
              : detalhesRetirada
                ? [detalhesRetirada]
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
              setLoteIds([]);
              setLoteFretes([]);
            }}
          >
            <BottomSheetView className="flex-1 p-4">
              <ScrollView showsVerticalScrollIndicator={false}>
                <H4 className="mb-4">Lançar Ocorrência</H4>
                {isLote && loteIds.length > 0 && (
                  <View className="mb-4">
                    <P className="mb-2 font-bold text-blue-900">
                      Ocorrência em lote para os IDs/fretes:
                    </P>
                    <P className="text-xs text-blue-900">
                      {loteIds.map(
                        (id, idx) =>
                          ` Retirada: ${id} - Frete: ${loteFretes[idx]} | `,
                      )}
                    </P>
                  </View>
                )}
                <View className="mb-4">
                  <P className="mb-2">Retirada:</P>
                  <TextInput
                    className="h-12 rounded-lg border border-gray-300 px-4"
                    value={isLote ? loteIds.join(", ") : retiradaId}
                    editable={false}
                  />
                </View>
                <View className="mb-4">
                  <P className="mb-2">Frete:</P>
                  <TextInput
                    className="h-12 rounded-lg border border-gray-300 px-4"
                    value={isLote ? loteFretes.join(", ") : ""}
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
