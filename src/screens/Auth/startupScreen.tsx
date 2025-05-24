/* eslint-disable jsx-a11y/alt-text */
import { Image, ScrollView, View } from "react-native";

import LogoIcon from "@assets/icon.png";
import NavigationIcon from "@assets/Navigation.png";
import DocumentIcon from "@assets/document.png";
import BulbIcon from "@assets/bulb.png";
import InsightsIcon from "@assets/insights.png";
import { ContainerX } from "@components/ContainerX";
import { H3, H4, P } from "@components/Typography";
import { Button } from "@components/Button";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<RootStackParamList, "StartupScreen">;
export function StartupScreen({ navigation }: Props) {
  function handleStart() {
    navigation.navigate("SignInScreen");
  }
  return (
    <ContainerX>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 20,
          paddingHorizontal: 30,
        }}
      >
        <View className="flex-1 justify-between">
          <View className="">
            <Image
              source={LogoIcon}
              className="mb-6 h-24 w-24 self-start"
              resizeMode="contain"
            />
            <H3 className="text-grayscale-600">Boas vindas ao SRD Soluções</H3>

            <P className="mt-3 text-base text-grayscale-500">
              Gerencie e rastreie documentos{"\n"}logísticos de forma eficiente.
            </P>

            <View className="gap-6">
              <P className="mt-6 text-base text-grayscale-500">
                Veja como funciona:
              </P>
              <View className="flex-row gap-4">
                <Image
                  source={NavigationIcon}
                  className="h-[30px] w-[30px]"
                  resizeMode="contain"
                />

                <View className="flex-1 gap-1 overflow-hidden">
                  <H4 className="text-grayscale-600">
                    Rastreamento Inteligente
                  </H4>

                  <P className="text-sm text-grayscale-500">
                    Acompanhe entregas, coletas e transferências em tempo real.
                  </P>
                </View>
              </View>

              <View className="flex-row gap-4">
                <Image
                  source={DocumentIcon}
                  className="h-[30px] w-[30px]"
                  resizeMode="contain"
                />

                <View className="flex-1 gap-1 overflow-hidden">
                  <H4 className="text-grayscale-600">Gestão Simplificada</H4>

                  <P className="text-sm text-grayscale-500">
                    Organize e controle documentos de transporte facilmente.
                  </P>
                </View>
              </View>

              <View className="flex-row gap-4">
                <Image
                  source={InsightsIcon}
                  className="h-[30px] w-[30px]"
                  resizeMode="contain"
                />

                <View className="flex-1 gap-1 overflow-hidden">
                  <H4 className="text-grayscale-600">Consulta Rápida</H4>

                  <P className="text-sm text-grayscale-500">
                    Encontre informações sobre manifestos, despachos e retiradas
                    em segundos.
                  </P>
                </View>
              </View>

              <View className="flex-row gap-4">
                <Image
                  source={BulbIcon}
                  className="h-[30px] w-[30px]"
                  resizeMode="contain"
                />

                <View className="flex-1 gap-1 overflow-hidden">
                  <H4 className="text-grayscale-600">
                    Tecnologia a Serviço da Logística
                  </H4>

                  <P className="text-sm text-grayscale-500">
                    Automação e eficiência no gerenciamento de dados.
                  </P>
                </View>
              </View>
            </View>
          </View>

          <View className="mt-5">
            <Button className="h-14" variant="default" onPress={handleStart}>
              <H4 className="text-grayscale-1">Começar</H4>
            </Button>
          </View>
        </View>
      </ScrollView>
    </ContainerX>
  );
}
