import React from "react";
import { Pressable } from "react-native";

interface BackButtonProps extends React.ComponentProps<typeof Pressable> {
  children: React.ReactNode;
}

export function BackButton({ children, ...rest }: BackButtonProps) {
  return <Pressable {...rest}>{children}</Pressable>;
}
