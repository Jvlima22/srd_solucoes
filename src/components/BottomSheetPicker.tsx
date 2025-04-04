import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetFlatList,
} from '@gorhom/bottom-sheet'
import { Pressable } from 'react-native';
import { H2, H3 } from './Typography';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check } from 'lucide-react-native';
import { COLORS } from '@styles/colors';

interface PickerProps {
  name: string
  value: string
}

interface Props {
  selected: PickerProps | null;
  data: PickerProps[];
  onChangeValue: (value: PickerProps) => void
}

export interface BottomSheetPickerChoiceRef {
  showBottomSheet: () => void
  closeBottomSheet: () => void
}

export const BottomSheetPicker = forwardRef<
  BottomSheetPickerChoiceRef,
  Props
>(({ onChangeValue, data, selected = null }, ref) => {
  const insets = useSafeAreaInsets()
  const bottomSheetRef = useRef<BottomSheet>(null)

  useImperativeHandle(ref, () => ({
    showBottomSheet: () => {
      bottomSheetRef.current?.expand()
    },
    closeBottomSheet: () => {
      bottomSheetRef.current?.close()
    },
  }))

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        pressBehavior="close"
        disappearsOnIndex={-1}
      />
    ),
    [],
  )

  const handleSetValue = (value: PickerProps) => {
    bottomSheetRef.current?.close()
    onChangeValue(value)
  }

  return (
    <BottomSheet
      ref={bottomSheetRef}
      backdropComponent={renderBackdrop}
      enablePanDownToClose={true}
      enableDynamicSizing
      index={-1}
    >
      <BottomSheetFlatList 
        data={data}
        keyExtractor={(item) => String(item.value)}
        contentContainerStyle={{
          paddingBottom: insets.bottom,
          paddingHorizontal: 20,
          gap: 8
        }}
        renderItem={({ item }) => (
          <Pressable
            onPress={handleSetValue.bind(null, item)}
            className='flex-row items-center justify-between'
          >
            <H3 className='text-grayscale-90'>{item.name}</H3>

            {selected?.value === item.value && (
              <Check
                size={24}
                color={COLORS.chathams_blue[900]}
              />
            )}
          </Pressable>
        )}
      />
    </BottomSheet>
  )
})

BottomSheetPicker.displayName = 'BottomSheetPicker'
