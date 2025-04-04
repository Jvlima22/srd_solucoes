import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type Props = {
  children: React.ReactNode
}
export function ContainerX({ children }: Props) {
  const insets = useSafeAreaInsets()
  return (
    <View
      className="bg-grayscale-1 flex-1"
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      {children}
    </View>
  )
}
