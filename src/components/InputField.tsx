import React from "react";
import { View, TextInput, Pressable, TextInputProps } from "react-native";

interface InputFieldProps extends TextInputProps {
  rightIcon?: React.ReactNode;
  onPressRightIcon?: () => void;
}

export const InputField: React.FC<InputFieldProps> = ({
  rightIcon,
  onPressRightIcon,
  style,
  ...props
}) => (
  <View
    style={{
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 4,
    }}
    className="h-14 w-full rounded-xl bg-grayscale-0"
  >
    <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
      <TextInput
        className="flex-1 px-7"
        style={[{ paddingRight: rightIcon ? 32 : 0 }, style]}
        {...props}
      />
      {rightIcon && (
        <Pressable
          onPress={onPressRightIcon}
          style={{ position: "absolute", right: 24 }}
          hitSlop={10}
        >
          {rightIcon}
        </Pressable>
      )}
    </View>
  </View>
);
