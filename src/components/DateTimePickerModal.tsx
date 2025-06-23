import React from "react";
import { Platform } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

interface Props {
  visible: boolean;
  mode: "date" | "time" | "datetime";
  onConfirm: (date: Date) => void;
  onCancel: () => void;
  initialDate?: Date;
}

export const CustomDateTimePicker: React.FC<Props> = ({
  visible,
  mode,
  onConfirm,
  onCancel,
  initialDate,
}) => {
  return (
    <DateTimePickerModal
      isVisible={visible}
      mode={mode}
      onConfirm={onConfirm}
      onCancel={onCancel}
      date={initialDate || new Date()}
      display={Platform.OS === "ios" ? "inline" : "default"}
      locale="pt-BR"
      confirmTextIOS="Confirmar"
      cancelTextIOS="Cancelar"
      pickerContainerStyleIOS={{
        justifyContent: "center",
        alignItems: "center",
      }}
    />
  );
};
