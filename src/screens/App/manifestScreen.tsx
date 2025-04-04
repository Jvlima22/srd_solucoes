/* eslint-disable jsx-a11y/alt-text */
import { createRef, useState } from 'react'
import { Image, Platform, ScrollView, TextInput, View } from 'react-native'
import { Button } from '@components/Button'
import { ContainerAppCpX } from '@components/ContainerAppCpX'
import { H1, H3, P } from '@components/Typography'
import { ChevronDown as IconDown } from 'lucide-react-native';

import ArrowRight from '@assets/Arrow-right.png'
import ArrowLeft from '@assets/Arrow-left.png'
import ArrowUp from '@assets/Arrow-up.png'
import ArrowDown from '@assets/Arrow-down.png'
import CurvedArrow from '@assets/Curved-Arrow.png'
import { BottomSheetPickerChoiceRef, BottomSheetPicker } from '@components/BottomSheetPicker'

export function ManifestScreen() {
  const [selectStatus, setSelectStatus] = useState<{name: string, value: string}|null>(null)
  const bottomSheetPicker = createRef<BottomSheetPickerChoiceRef>()
  return (
    <>
    <ContainerAppCpX>
      <View className="flex-1">
      <ScrollView contentContainerClassName='p-7' showsVerticalScrollIndicator={false}>
        <H1>Relação de Manifesto</H1>

        <View className="mt-4 w-full gap-3">
          <H3 className="text-xl">Manifesto:</H3>
          <View
            className={`h-14 w-full rounded-xl bg-grayscale-0 ${Platform.OS === 'ios' ? 'shadow shadow-black/50' : 'elevation-4'}`}
          >
            <TextInput className="flex-1 px-7" 
              placeholder='Digite o número do manifesto'
            />
          </View>
        </View>

        <View className="mt-4 w-full gap-3">
          <H3 className="text-xl">Status:</H3>
          <View
            className={`flex-row items-center px-3 rounded-xl bg-grayscale-0 ${Platform.OS === 'ios' ? 'shadow shadow-black/50' : 'elevation-4'}`}
          >
            <TextInput className="flex-1 h-14 pl-3"
              editable={false}
              placeholder='Selecione o status'
              value={selectStatus?.name}
              onPress={() => bottomSheetPicker.current?.showBottomSheet()}
            />

            <IconDown 
              color={'#000'}
              size={24}
            />
          </View>
        </View>

        <View className="mt-8">
          <Button className="w-1/2">
            <H3 className="text-base font-bold text-white">Pesquisar</H3>
          </Button>
        </View>

        
          <View className="mt-8">
            <View className="border border-zinc-600 p-5">
              <View className="mb-5 w-1/2 flex-row items-center justify-center gap-3 self-center rounded-xl bg-blue-900 p-3">
                <P className="text-white">MANIFESTO</P>

                <View className="h-6 w-6 items-center justify-center rounded-full bg-white">
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
          </View>

          <View className="mt-8">
            <View className="border border-zinc-600 p-5">
              <View className="mb-5 w-1/2 flex-row items-center justify-center gap-3 self-center rounded-xl bg-blue-900 p-3">
                <P className="text-white">MANIFESTO</P>

                <View className="h-6 w-6 items-center justify-center rounded-full bg-white">
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
          </View>

          <View className="mt-8">
            <View className="border border-zinc-600 p-5">
              <View className="mb-5 w-1/2 flex-row items-center justify-center gap-3 self-center rounded-xl bg-blue-900 p-3">
                <P className="text-white">MANIFESTO</P>

                <View className="h-6 w-6 items-center justify-center rounded-full bg-white">
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
          </View>
        </ScrollView>
      </View>

      
    </ContainerAppCpX>
    <BottomSheetPicker 
        ref={bottomSheetPicker}
        selected={selectStatus}
        data={[
          { name: 'Ativo', value: 'Ativo' },
          { name: 'Coletado', value: 'Coletado' },
          { name: 'Cancelado', value: 'Cancelado' },
        ]}
        onChangeValue={(value) => {
          setSelectStatus(value)
        }}
      />
    </>
  )
}
