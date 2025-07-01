import React from "react";
import { View, Pressable, Alert, ActionSheetIOS, Platform } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { P } from "./Typography";

interface FileUploadProps {
  onFileSelect: (file: {
    uri: string;
    name: string;
    type: string;
    size?: number;
  }) => void;
  selectedFile: {
    uri: string;
    name: string;
    type: string;
    size?: number;
  } | null;
  isRequired?: boolean;
  getInputBorderColor: (value: any, obrigatorio: boolean) => string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  selectedFile,
  isRequired = false,
  getInputBorderColor,
}) => {
  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissão necessária",
        "Precisamos de permissão para acessar a câmera.",
      );
      return false;
    }
    return true;
  };

  const requestMediaLibraryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissão necessária",
        "Precisamos de permissão para acessar a galeria.",
      );
      return false;
    }
    return true;
  };

  const handleTakePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const fileName = asset.fileName || `media_${Date.now()}`;
        onFileSelect({
          uri: asset.uri,
          name: fileName,
          type: asset.type || "application/octet-stream",
          size: asset.fileSize,
        });
      }
    } catch (error) {
      console.error("Erro ao tirar foto ou gravar vídeo:", error);
      Alert.alert(
        "Erro",
        "Erro ao tirar foto ou gravar vídeo. Tente novamente.",
      );
    }
  };

  const handleSelectFromGallery = async () => {
    const hasPermission = await requestMediaLibraryPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const fileName = asset.fileName || `media_${Date.now()}`;
        onFileSelect({
          uri: asset.uri,
          name: fileName,
          type: asset.type || "application/octet-stream",
          size: asset.fileSize,
        });
      }
    } catch (error) {
      console.error("Erro ao selecionar mídia:", error);
      Alert.alert("Erro", "Erro ao selecionar mídia. Tente novamente.");
    }
  };

  const handleSelectDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "video/*", "application/pdf"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        onFileSelect({
          uri: file.uri,
          name: file.name,
          type: file.mimeType || "application/octet-stream",
          size: file.size,
        });
      }
    } catch (error) {
      console.error("Erro ao selecionar arquivo:", error);
      Alert.alert("Erro", "Erro ao selecionar arquivo. Tente novamente.");
    }
  };

  const handleChooseFile = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [
            "Cancelar",
            "Fototeca",
            "Tirar Foto ou gravar vídeo",
            "Escolher Arquivos",
          ],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) handleSelectFromGallery();
          if (buttonIndex === 2) handleTakePhoto();
          if (buttonIndex === 3) handleSelectDocument();
        },
      );
    } else {
      Alert.alert("Escolher opção", undefined, [
        { text: "Fototeca", onPress: handleSelectFromGallery },
        { text: "Tirar Foto ou gravar vídeo", onPress: handleTakePhoto },
        { text: "Escolher Arquivo", onPress: handleSelectDocument },
        { text: "Cancelar", style: "cancel" },
      ]);
    }
  };

  return (
    <View className="mb-4">
      <View className="flex-row items-center gap-2">
        <Pressable
          onPress={handleChooseFile}
          style={{
            borderWidth: 2,
            borderColor: getInputBorderColor(selectedFile, isRequired),
            backgroundColor: "#f5f5f5",
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 4,
          }}
        >
          <P style={{ color: "#222", fontWeight: "bold" }}>Escolher Arquivos</P>
        </Pressable>
      </View>
      <P style={{ color: "#222", marginTop: 4 }}>
        {selectedFile ? selectedFile.name : "Nenhum ficheiro selecionado"}
      </P>
    </View>
  );
};
