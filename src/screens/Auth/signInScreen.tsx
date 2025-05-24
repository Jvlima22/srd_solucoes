import {
  BottomSheetPicker,
  type BottomSheetPickerChoiceRef,
} from "@components/BottomSheetPicker";
import { Button } from "@components/Button";
import { ContainerX } from "@components/ContainerX";
import { H1, H2, H3, H4, P } from "@components/Typography";
import { useAuth } from "@hooks/useAuth";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ArrowLeft, Eye, EyeOff } from "lucide-react-native";
import { createRef, useState } from "react";
import {
  View,
  Pressable,
  Platform,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";

type Props = NativeStackScreenProps<RootStackParamList, "SignInScreen">;
export function SignInScreen({ navigation }: Props) {
  const [selectStatus, setSelectStatus] = useState<{
    name: string;
    value: string;
  } | null>(null);
  const bottomSheetPicker = createRef<BottomSheetPickerChoiceRef>();
  const [form, setForm] = useState({
    login: "",
    senha: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  function handleBack() {
    navigation.goBack();
  }

  async function handleLogIn() {
    if (!selectStatus) {
      alert("Selecione a unidade");
      return;
    }
    if (!form.login) {
      alert("Preencha o campo de login");
      return;
    }
    if (!form.senha) {
      alert("Preencha o campo de senha");
      return;
    }
    setIsLoading(true);
    try {
      await signIn(selectStatus?.value!, form.login, form.senha);
    } catch (error) {
      console.log("SIGNIN SCREEN", error);
      alert("Não foi possível fazer o login, tente novamente!");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ContainerX>
      <View className="flex-1 p-7">
        <View className="items-center pt-7">
          <Pressable
            onPress={handleBack}
            className={`absolute left-5 top-5 z-10 h-14 w-14 items-center justify-center rounded-lg bg-blue-950 ${
              Platform.OS === "ios" ? "shadow shadow-black/50" : "elevation-4"
            }`}
          >
            <ArrowLeft size={24} color="#fff" />
          </Pressable>

          <H2 className="font-bold text-blue-950">Log In</H2>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
          onTouchStart={() => Keyboard.dismiss()}
        >
          <View className="flex-1 items-center justify-center gap-3">
            <H4 className="font-bold">Bem-vindo(a)</H4>
            <P className="text-center text-base">
              O usuário deve inserir suas credenciais{"\n"}e senha nos campos
              correspondentes.
            </P>

            <View className="mt-4 w-full gap-3">
              <P className="text-lg font-medium">Unidade</P>
              <Pressable
                onPress={() => bottomSheetPicker.current?.showBottomSheet()}
              >
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
                    editable={false}
                    placeholder="Selecione a unidade"
                    value={selectStatus?.name}
                    pointerEvents="none"
                  />
                </View>
              </Pressable>
            </View>

            <View className="w-full gap-3">
              <P className="text-lg font-medium">Login</P>
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
                  value={form.login}
                  onChangeText={(text) => setForm({ ...form, login: text })}
                  placeholder="Digite seu login"
                />
              </View>
            </View>

            <View className="w-full gap-3">
              <P className="text-lg font-medium">Senha</P>
              <View
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.25, // Equivalent to #00000040
                  shadowRadius: 4,
                  elevation: 4, // For Android
                }}
                className="h-14 w-full flex-row items-center rounded-xl bg-grayscale-0 px-3"
              >
                <TextInput
                  className="flex-1 px-7"
                  secureTextEntry={!showPassword}
                  placeholder="Digite sua senha"
                  value={form.senha}
                  onChangeText={(text) => setForm({ ...form, senha: text })}
                  onSubmitEditing={handleLogIn}
                  returnKeyType="done"
                />
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeOff size={24} color="#000" />
                  ) : (
                    <Eye size={24} color="#000" />
                  )}
                </Pressable>
              </View>
            </View>

            <View className="mt-10 w-1/2">
              <Button
                onPress={handleLogIn}
                className="h-14"
                variant="default"
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <H4 className="text-grayscale-1">Log In</H4>
                )}
              </Button>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>

      <BottomSheetPicker
        ref={bottomSheetPicker}
        selected={selectStatus}
        data={[
          { name: "Agente", value: "Agente" },
          { name: "Cliente", value: "Cliente" },
          { name: "Motorista", value: "Motorista" },
          { name: "Transportadora", value: "Transportadora" },
          { name: "Usuario", value: "Usuario" },
        ]}
        onChangeValue={(value) => {
          setSelectStatus(value);
        }}
      />
    </ContainerX>
  );
}
