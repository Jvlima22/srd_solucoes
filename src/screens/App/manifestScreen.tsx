/* eslint-disable jsx-a11y/alt-text */
import { createRef, useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  FlatList,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  View,
  Pressable,
} from "react-native";
import { Button } from "@components/Button";
import { ContainerAppCpX } from "@components/ContainerAppCpX";
import { H3, H4, P } from "@components/Typography";
import { ChevronDown as IconDown } from "lucide-react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

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
import { api } from "@/service/api";

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

export function ManifestScreen() {
  const navigation = useNavigation();
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
  const [ocorrencias, setOcorrencias] = useState<RootObject[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getInfoManifest();
      setManifests(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
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

  const filteredManifests = manifests.filter((manifest) =>
    manifest.id_manifesto.toString().includes(searchTerm),
  );

  const handleBaixarOcorrencias = async (idManifesto: number) => {
    try {
      const response = await api.get(`/manifestos/ocorrencias/${idManifesto}`);
      setOcorrencias(response.data);
      setModalVisible(true);
      bottomSheetRef.current?.expand();
    } catch (error) {
      console.error("Error fetching ocorrencias:", error);
    }
  };

  const handleNavigateToScreen = (tipo: string) => {
    setModalVisible(false);
    bottomSheetRef.current?.close();
    
    switch (tipo.toLowerCase()) {
      case 'entrega':
        navigation.navigate('DeliveryScreen' as never);
        break;
      case 'coleta':
        navigation.navigate('CollectionScreen' as never);
        break;
      case 'despacho':
        navigation.navigate('DispatchScreen' as never);
        break;
      case 'retirada':
        navigation.navigate('WithDrawalScreen' as never);
        break;
      case 'transferência':
      case 'transferencia':
        navigation.navigate('TransferScreen' as never);
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
    <>
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
                      onPress={() =>
                        bottomSheetPicker.current?.showBottomSheet()
                      } // Substitua o alert pelo comportamento desejado
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

                {/* <View className="mt-4 w-full gap-3">
          <H3 className="text-xl">Buscar Manifesto:</H3>
          <View
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 4,
            }}
            className="h-14 w-full rounded-xl bg-grayscale-0"
          >
            <TextInput
              className="flex-1 px-7"
              placeholder="Digite o número do manifesto"
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View>
        </View> */}

                <View className="mt-8">
                  <Button className="w-1/2">
                    <H3 className="text-base font-bold text-white">
                      Pesquisar
                    </H3>
                  </Button>
                </View>
              </View>
            )}
            renderItem={({ item }) => (
              <View className="mt-8">
                <View className="border border-zinc-600 p-5">
                  <View className="mb-5 w-1/2 flex-row items-center justify-center gap-3 self-center rounded-xl bg-blue-900 p-3">
                    <P className="text-white">MANIFESTO</P>

                    <View className="h-6 w-6 items-center justify-center rounded-full bg-white">
                      <P>{item.id_manifesto}</P>
                    </View>
                  </View>

                  <View className="flex-col gap-3">
                    <View className="flex-row items-center gap-3">
                      <Image source={ArrowRight} className="h-7 w-7" />

                      <P>Entrega - {item.entrega}</P>
                    </View>

                    <View className="flex-row items-center gap-3">
                      <Image source={ArrowLeft} className="h-7 w-7" />

                      <P>Coleta - {item.coleta}</P>
                    </View>

                    <View className="flex-row items-center gap-3">
                      <Image source={ArrowUp} className="h-7 w-7" />

                      <P>Despacho - {item.despacho}</P>
                    </View>

                    <View className="flex-row items-center gap-3">
                      <Image source={ArrowDown} className="h-7 w-7" />

                      <P>Retirada - {item.retirada}</P>
                    </View>

                    <View className="flex-row items-center gap-3">
                      <Image source={CurvedArrow} className="h-7 w-7" />

                      <P>Transferência - {item.transferencia}</P>
                    </View>
                  </View>

                  <View className="mt-8 items-center justify-center">
                    <Button
                      className="w-1/3"
                      onPress={() => handleBaixarOcorrencias(item.id_manifesto)}
                    >
                      <H3 className="text-white">Baixar</H3>
                    </Button>
                  </View>
                </View>
              </View>
            )}
          />
        </View>
      </ContainerAppCpX>

      <BottomSheetPicker
        ref={bottomSheetPicker}
        selected={selectStatus}
        data={[
          { name: "Ativo", value: "Ativo" },
          { name: "Coletado", value: "Coletado" },
          { name: "Cancelado", value: "Cancelado" },
        ]}
        onChangeValue={(value) => {
          setSelectStatus(value);
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
              <View className="flex-row items-center justify-between mb-4">
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
                <View key={index} className="mb-5 bg-white rounded-lg p-4 shadow">
                  <View className="border-b border-gray-200 pb-2 mb-2">
                    <H4 className="text-blue-900">Ocorrência #{index + 1}</H4>
                  </View>
                  
                  {Object.entries(ocorrencia).map(([key, value]) => {
                    if (key === 'tipo' && value) {
                      return (
                        <View key={key} className="mt-4">
                          <Button
                            onPress={() => handleNavigateToScreen(value as string)}
                            className="bg-blue-900"
                          >
                            <P className="text-white">Ir para {value}</P>
                          </Button>
                        </View>
                      );
                    }
                    return (
                      <View key={key} className="flex-row py-1">
                        <P className="font-bold capitalize">{key.replace('_', ' ')}: </P>
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
    </>
  );
}
