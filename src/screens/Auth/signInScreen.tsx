import { Button } from "@components/Button";
import { ContainerX } from "@components/ContainerX";
import { H2, H4, P } from "@components/Typography";
import { useAuth } from "@hooks/useAuth";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ArrowLeft, Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import {
  View,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import type { RootStackParamList } from "../../@types/routes";
import { InputField } from "@components/InputField";
import { BackButton } from "@components/BackButton";
import { AutocompleteInput } from "@components/AutocompleteInput";

type Props = NativeStackScreenProps<RootStackParamList, "SignInScreen">;

export function SignInScreen({ navigation }: Props) {
  const [selectedUnidade, setSelectedUnidade] = useState<Unidade | null>(null);
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

  const handleSelectUnidade = (unidade: Unidade) => {
    setSelectedUnidade(unidade);
  };

  async function handleLogIn() {
    if (!selectedUnidade) {
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
      await signIn(selectedUnidade.identificador, form.login, form.senha);
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
          <BackButton
            onPress={handleBack}
            className={`absolute left-5 top-5 z-10 h-14 w-14 items-center justify-center rounded-lg bg-blue-950 ${
              Platform.OS === "ios" ? "shadow shadow-black/50" : "elevation-4"
            }`}
          >
            <ArrowLeft size={24} color="#fff" />
          </BackButton>

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
              <AutocompleteInput
                value={selectedUnidade?.nome || ""}
                onChangeText={() => {}}
                onSelectUnidade={handleSelectUnidade}
                placeholder="Digite para buscar a unidade"
                selectedUnidade={selectedUnidade}
              />
            </View>

            <View className="w-full gap-3">
              <P className="text-lg font-medium">Login</P>
              <InputField
                value={form.login}
                onChangeText={(text) => setForm({ ...form, login: text })}
                placeholder="Digite seu login"
              />
            </View>

            <View className="w-full gap-3">
              <P className="text-lg font-medium">Senha</P>
              <InputField
                value={form.senha}
                onChangeText={(text) => setForm({ ...form, senha: text })}
                placeholder="Digite sua senha"
                secureTextEntry={!showPassword}
                rightIcon={
                  showPassword ? (
                    <EyeOff size={24} color="#000" />
                  ) : (
                    <Eye size={24} color="#000" />
                  )
                }
                onPressRightIcon={() => setShowPassword(!showPassword)}
                onSubmitEditing={handleLogIn}
                returnKeyType="done"
              />
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
    </ContainerX>
  );
}
