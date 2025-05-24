/* eslint-disable jsx-a11y/alt-text */
import { Button } from "@components/Button";
import { ContainerAppCpX } from "@components/ContainerAppCpX";
import { H1, H4, P } from "@components/Typography";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  View,
} from "react-native";

import ArrowRight from "@assets/Arrow-right.png";
import ArrowLeft from "@assets/Arrow-left.png";
import ArrowUp from "@assets/Arrow-up.png";
import ArrowDown from "@assets/Arrow-down.png";
import CurvedArrow from "@assets/Curved-Arrow.png";
import { useEffect, useState } from "react";
import { getInfoRetirada } from "@/service/services";
import { CustomModal } from "@/components/CustomModal";

export function WithDrawalScreen() {
  const [entregas, setEntregas] = useState<retiradaDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<retiradaDTO | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getInfoRetirada();
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
      const response = await getInfoRetirada();
      setEntregas(response.data);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
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
        <H4>Relação de Retirada</H4>

        <FlatList
          data={entregas}
          keyExtractor={(item, index) =>
            String(item.minuta_numero + "srp" + index)
          }
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
                  <P className="text-white">Minuta N°</P>

                  <View className="h-8 min-w-8 items-center justify-center rounded-full bg-white p-1">
                    <P>{item.minuta_numero}</P>
                  </View>
                </View>

                <View className="flex-col">
                  <View className="flex-row items-center gap-3">
                    <P className="text-sm font-bold">
                      Total Frete - {item.total_frete}
                    </P>
                  </View>

                  <View className="flex-row items-center gap-3">
                    <P className="text-sm">
                      Total Documento - {item.total_documento}
                    </P>
                  </View>

                  <View className="flex-row items-center gap-3">
                    <P className="text-sm">
                      Total Volume - {item.total_volume}
                    </P>
                  </View>

                  <View className="flex-row items-center gap-3">
                    <P className="text-sm">Local - {item.local}</P>
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

                <View className="mt-8 items-center justify-center">
                  <Button
                    onPress={() => {
                      setSelectedItem(item);
                      setModalVisible(true);
                    }}
                    className="w-1/3"
                    size="icon"
                  >
                    <P className="text-xl text-white">Detalhe</P>
                  </Button>
                </View>

                <View className="mt-3 items-center justify-center">
                  <Button disabled size="icon" className="w-1/3 min-w-[200px]">
                    <P className="text-xl text-white">Lançar ocorrência</P>
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
              <H1 className="text-white">
                Minuta Número: {selectedItem.minuta_numero}
              </H1>
              <P className="text-white">Local: {selectedItem.local}</P>
              <P className="text-white">Status: {selectedItem.status}</P>
            </View>
          )}
        </CustomModal>
      </View>
    </ContainerAppCpX>
  );
}
