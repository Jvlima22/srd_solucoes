import React from "react";
import { Modal, Pressable, TouchableOpacity, View } from "react-native";
import { P } from "@components/Typography";

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  onClose,
  children,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center bg-black/60">
        <View className="w-11/12 rounded-lg bg-blue-900 p-5">
          <TouchableOpacity
            className="absolute right-3 top-3 h-8 w-8 items-center justify-center rounded-full bg-white"
            onPress={onClose}
          >
            <P className="text-black">X</P>
          </TouchableOpacity>
          {children}
        </View>
      </View>
    </Modal>
  );
};
