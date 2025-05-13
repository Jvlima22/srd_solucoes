/* eslint-disable jsx-a11y/alt-text */
import { Image, ScrollView, View } from 'react-native'

import LogoIcon from '@assets/icon.png'
import NavigationIcon from '@assets/Navigation.png'
import DocumentIcon from '@assets/document.png'
import BulbIcon from '@assets/bulb.png'
import InsightsIcon from '@assets/insights.png'
import { ContainerX } from '@components/ContainerX'
import { H2, H3, P } from '@components/Typography'
import { Button } from '@components/Button'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'

type Props = NativeStackScreenProps<RootStackParamList, 'StartupScreen'>
export function StartupScreen({ navigation }: Props) {
  function handleStart() {
    navigation.navigate('SignInScreen')
  }
  return (
    <ContainerX>
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
      <View className="flex-1 justify-between p-5">
        <View className="">
          <Image
            source={LogoIcon}
            className="mb-6 h-24 w-24 self-start"
            resizeMode="contain"
          />
          <H2 className="text-grayscale-600">Boas vindas ao SRP Soluções</H2>

          <P className="text-grayscale-500 text-2xl">
            Gerencie e rastreie documentos{'\n'}logísticos de forma eficiente.
          </P>

          <View className="gap-6">
            <P className="text-grayscale-500 mt-10 text-2xl">
              Veja como funciona:
            </P>
            <View className="flex-row gap-4">
              <Image
                source={NavigationIcon}
                className="h-10 w-10 rounded-3xl"
                resizeMode="contain"
              />

              <View className="flex-1 gap-1 overflow-hidden">
                <H3 className="text-grayscale-600">Rastreamento Inteligente</H3>

                <P className="text-grayscale-500">
                  Acompanhe entregas, coletas e transferências em tempo real.
                </P>
              </View>
            </View>

            <View className="flex-row gap-4">
              <Image
                source={DocumentIcon}
                className="h-10 w-10 rounded-3xl"
                resizeMode="contain"
              />

              <View className="flex-1 gap-1 overflow-hidden">
                <H3 className="text-grayscale-600">Gestão Simplificada</H3>

                <P className="text-grayscale-500">
                  Organize e controle documentos de transporte facilmente.
                </P>
              </View>
            </View>

            <View className="flex-row gap-4">
              <Image
                source={InsightsIcon}
                className="h-10 w-10 rounded-3xl"
                resizeMode="contain"
              />

              <View className="flex-1 gap-1 overflow-hidden">
                <H3 className="text-grayscale-600">Consulta Rápida</H3>

                <P className="text-grayscale-500">
                  Encontre informações sobre manifestos, despachos e retiradas
                  em segundos.
                </P>
              </View>
            </View>

            <View className="flex-row gap-4">
              <Image
                source={BulbIcon}
                className="h-10 w-10 rounded-3xl"
                resizeMode="contain"
              />

              <View className="flex-1 gap-1 overflow-hidden">
                <H3 className="text-grayscale-600">
                  Tecnologia a Serviço da Logística
                </H3>

                <P className="text-grayscale-500">
                  Automação e eficiência no gerenciamento de dados.
                </P>
              </View>
            </View>
          </View>
        </View>

        <View className="mt-5">
          <Button className="h-14" variant="default" onPress={handleStart}>
            <H3 className="text-grayscale-1">Começar</H3>
          </Button>
        </View>
      </View>
      </ScrollView>
    </ContainerX>
  )
}
