/* eslint-disable jsx-a11y/alt-text */
import { Button } from "@components/Button";
import { ContainerAppCpX } from "@components/ContainerAppCpX";
import { H1, H3, H4, P } from "@components/Typography";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  TouchableOpacity,
  View,
} from "react-native";
import axios from "axios";

import { useEffect, useState } from "react";
import { getInfoEntrega } from "@/service/services";

export function DeliveryScreen() {
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

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getInfoEntrega();
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
      const response = await getInfoEntrega();
      setEntregas(response.data);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleLancarOcorrencia = async (documentoId: number) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/ocorrencia/entrega/${documentoId}`,
      );
      setOcorrenciaData(response.data[0]);
    } catch (error) {
      console.error("Error fetching ocorrencia data:", error);
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
                <View className="mb-3 w-1/2 flex-row items-center justify-center gap-3 self-center rounded-xl bg-system p-3">
                  <P className="text-white">Documento</P>

                  <View className="h-8 min-w-8 items-center justify-center rounded-full bg-white p-1">
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
                    <P className="text-xl text-white">Detalhe</P>
                  </Button>
                </View>

                <View className="mt-2 items-center justify-center">
                  <Button
                    size="icon"
                    className="w-1/3 min-w-[200px]"
                    onPress={() => handleLancarOcorrencia(item.documento)}
                  >
                    <P className="text-xl text-white">Lançar ocorrência</P>
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
      </View>
    </ContainerAppCpX>
  );
}
