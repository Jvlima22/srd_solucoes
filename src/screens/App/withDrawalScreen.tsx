/* eslint-disable jsx-a11y/alt-text */
import { Button } from '@components/Button'
import { ContainerAppCpX } from '@components/ContainerAppCpX'
import { H1, P } from '@components/Typography'
import { Image, ScrollView, View } from 'react-native'

import ArrowRight from '@assets/Arrow-right.png'
import ArrowLeft from '@assets/Arrow-left.png'
import ArrowUp from '@assets/Arrow-up.png'
import ArrowDown from '@assets/Arrow-down.png'
import CurvedArrow from '@assets/Curved-Arrow.png'

export function WithDrawalScreen() {
  return (
    <ContainerAppCpX>
      <View className="flex-1 p-7">
        <H1>Relação de Retirada</H1>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="mt-8">
            <View className="border border-zinc-600 p-5">
              <View className="mb-5 w-1/2 flex-row items-center justify-center gap-3 self-center rounded-xl bg-blue-900 p-3">
                <P className="text-white">Minuta N°</P>

                <View className="h-8 min-w-8 items-center justify-center rounded-full bg-white p-1">
                  <P>2</P>
                </View>
              </View>

              <View className="flex-col gap-3">
                <View className="flex-row items-center gap-3">
                  <Image source={ArrowRight} className="h-7 w-7" />

                  <P>Entrega - 0 / 0</P>
                </View>

                <View className="flex-row items-center gap-3">
                  <Image source={ArrowLeft} className="h-7 w-7" />

                  <P>Coleta - 0 / 0</P>
                </View>

                <View className="flex-row items-center gap-3">
                  <Image source={ArrowUp} className="h-7 w-7" />

                  <P>Despacho - 0 / 0</P>
                </View>

                <View className="flex-row items-center gap-3">
                  <Image source={ArrowDown} className="h-7 w-7" />

                  <P>Retirada - 0 / 0</P>
                </View>

                <View className="flex-row items-center gap-3">
                  <Image source={CurvedArrow} className="h-7 w-7" />

                  <P>Transferência - 0 / 0</P>
                </View>
              </View>

              <View className="mt-8 items-center justify-center">
                <Button className="w-1/3">
                  <P className="text-xl text-white">Detalhe</P>
                </Button>
              </View>

              <View className="mt-8 items-center justify-center">
                <Button disabled className="w-1/3 min-w-[200px]">
                  <P className="text-xl text-white">Lançar ocorrência</P>
                </Button>
              </View>
            </View>
          </View>

          {/* <View className="mt-8">
            <View className="border border-zinc-600 p-5">
              <View className="mb-5 w-1/2 flex-row items-center justify-center gap-3 self-center rounded-xl bg-blue-900 p-3">
                <P className="text-white">Documento</P>

                <View className="h-8 min-w-8 items-center justify-center rounded-full bg-white p-1">
                  <P>500</P>
                </View>
              </View>

              <View className="flex-col gap-3">
                <View className="flex-row items-center gap-3">
                  <Image source={ArrowRight} className="h-7 w-7" />

                  <P>Entrega - 0 / 0</P>
                </View>

                <View className="flex-row items-center gap-3">
                  <Image source={ArrowLeft} className="h-7 w-7" />

                  <P>Coleta - 0 / 0</P>
                </View>

                <View className="flex-row items-center gap-3">
                  <Image source={ArrowUp} className="h-7 w-7" />

                  <P>Despacho - 0 / 0</P>
                </View>

                <View className="flex-row items-center gap-3">
                  <Image source={ArrowDown} className="h-7 w-7" />

                  <P>Retirada - 0 / 0</P>
                </View>

                <View className="flex-row items-center gap-3">
                  <Image source={CurvedArrow} className="h-7 w-7" />

                  <P>Transferência - 0 / 0</P>
                </View>
              </View>

              <View className="mt-8 items-center justify-center">
                <Button disabled className="w-1/3">
                  <H3 className="text-white">Baixar</H3>
                </Button>
              </View>
            </View>
          </View>

          <View className="mt-8">
            <View className="border border-zinc-600 p-5">
              <View className="mb-5 w-1/2 flex-row items-center justify-center gap-3 self-center rounded-xl bg-blue-900 p-3">
                <P className="text-white">Documento</P>

                <View className="h-8 min-w-8 items-center justify-center rounded-full bg-white p-1">
                  <P>2</P>
                </View>
              </View>

              <View className="flex-col gap-3">
                <View className="flex-row items-center gap-3">
                  <Image source={ArrowRight} className="h-7 w-7" />

                  <P>Entrega - 0 / 0</P>
                </View>

                <View className="flex-row items-center gap-3">
                  <Image source={ArrowLeft} className="h-7 w-7" />

                  <P>Coleta - 0 / 0</P>
                </View>

                <View className="flex-row items-center gap-3">
                  <Image source={ArrowUp} className="h-7 w-7" />

                  <P>Despacho - 0 / 0</P>
                </View>

                <View className="flex-row items-center gap-3">
                  <Image source={ArrowDown} className="h-7 w-7" />

                  <P>Retirada - 0 / 0</P>
                </View>

                <View className="flex-row items-center gap-3">
                  <Image source={CurvedArrow} className="h-7 w-7" />

                  <P>Transferência - 0 / 0</P>
                </View>
              </View>

              <View className="mt-8 items-center justify-center">
                <Button disabled className="w-1/3">
                  <H3 className="text-white">Baixar</H3>
                </Button>
              </View>
            </View>
          </View> */}
        </ScrollView>
      </View>
    </ContainerAppCpX>
  )
}
