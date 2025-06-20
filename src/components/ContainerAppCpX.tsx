import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { P } from "./Typography";

type Props = {
  children: React.ReactNode;
};
export function ContainerAppCpX({ children }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View
      className="flex-1 bg-grayscale-1"
      style={{
        // paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      {children}

      <P className="ml-10">© SRD Soluções - 2025</P>
    </View>
  );
}
