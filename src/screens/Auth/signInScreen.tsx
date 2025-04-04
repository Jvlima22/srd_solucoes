import { Button } from '@components/Button'
import { ContainerX } from '@components/ContainerX'
import { H1, H2, H3, P } from '@components/Typography'
import { useAuth } from '@hooks/useAuth'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { ArrowLeft } from 'lucide-react-native'
import {
  View,
  Pressable,
  Platform,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native'

type Props = NativeStackScreenProps<RootStackParamList, 'SignInScreen'>
export function SignInScreen({ navigation }: Props) {
  const { signIn } = useAuth()
  function handleBack() {
    navigation.goBack()
  }

  async function handleLogIn() {
    await signIn('21321', '21312', '3213213')
  }

  return (
    <ContainerX>
      <View className="flex-1 p-7">
        <View className="items-center pt-7">
          <Pressable
            onPress={handleBack}
            className={`absolute left-5 top-5 z-10 h-14 w-14 items-center justify-center rounded-lg bg-blue-950 ${
              Platform.OS === 'ios' ? 'shadow shadow-black/50' : 'elevation-4'
            }`}
          >
            <ArrowLeft size={24} color="#fff" />
          </Pressable>

          <H2 className="font-bold text-blue-950">Log In</H2>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
          onTouchStart={() => Keyboard.dismiss()}
        >
          <View className="flex-1 items-center justify-center gap-4">
            <H1>Bem-vindo(a)</H1>
            <P className="text-center text-base">
              O usuário deve inserir suas credenciais{'\n'}e senha nos campos
              correspondentes.
            </P>

            <View className="mt-4 w-full gap-3">
              <H3 className="text-xl">Unidade</H3>
              <View
                className={`h-14 w-full rounded-xl bg-grayscale-0 ${Platform.OS === 'ios' ? 'shadow shadow-black/50' : 'elevation-4'}`}
              >
                <TextInput className="flex-1 px-7" />
              </View>
            </View>

            <View className="w-full gap-3">
              <H3 className="text-xl">Login</H3>
              <View
                className={`h-14 w-full rounded-xl bg-grayscale-0 ${Platform.OS === 'ios' ? 'shadow shadow-black/50' : 'elevation-4'}`}
              >
                <TextInput className="flex-1 px-7" />
              </View>
            </View>

            <View className="w-full gap-3">
              <H3 className="text-xl">Senha</H3>
              <View
                className={`h-14 w-full rounded-xl bg-grayscale-0 ${Platform.OS === 'ios' ? 'shadow shadow-black/50' : 'elevation-4'}`}
              >
                <TextInput className="flex-1 px-7" />
              </View>
            </View>

            <View className="mt-10 w-1/2">
              <Button onPress={handleLogIn} className="h-14" variant="default">
                <H3 className="text-grayscale-1">Log In</H3>
              </Button>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </ContainerX>
  )
}
