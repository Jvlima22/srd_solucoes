import React from "react";
import { View, ActivityIndicator, TextInput } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { H4, P } from "./Typography";
import { BackButton } from "@components/BackButton";

interface PrimaryField {
  label: string;
  value: string | number;
}

interface TableColumn {
  header: string;
  accessor: string;
  flex?: number;
  render?: (item: any) => React.ReactNode;
}

interface DetailsBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  title: string;
  primaryFields: PrimaryField[];
  columns: TableColumn[];
  data: any[];
  isLoading: boolean;
  noDataMessage?: string;
  sheetIndex: number;
  setSheetIndex: (idx: number) => void;
}

export function DetailsBottomSheet({
  isOpen,
  onClose,
  bottomSheetRef,
  title,
  primaryFields,
  columns,
  data,
  isLoading,
  noDataMessage = "Nenhuma ocorrência encontrada",
  sheetIndex,
  setSheetIndex,
}: DetailsBottomSheetProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={["25%", "50%", "100%"]}
      enablePanDownToClose={true}
      onClose={onClose}
      index={sheetIndex}
      onChange={setSheetIndex}
    >
      <BottomSheetView
        style={{
          backgroundColor: "#fff",
          borderRadius: 8,
          padding: 20,
          minHeight: 400,
          justifyContent: "flex-start",
          flex: 1,
        }}
      >
        {/* Cabeçalho */}
        <View style={{ alignItems: "center", marginBottom: 16 }}>
          <H4 style={{ color: "#222", fontWeight: "bold", fontSize: 20 }}>
            {title}
          </H4>
        </View>

        {/* Campos Primários */}
        <View style={{ flexDirection: "row", gap: 16, marginBottom: 16 }}>
          {primaryFields.map((field) => (
            <View style={{ flex: 1 }} key={field.label}>
              <P style={{ color: "#222", marginBottom: 4 }}>{field.label}:</P>
              <TextInput
                style={{
                  height: 36,
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: "#d1d5db",
                  backgroundColor: "#f3f4f6",
                  paddingHorizontal: 8,
                  color: "#222",
                  fontSize: 16,
                }}
                value={String(field.value)}
                editable={false}
              />
            </View>
          ))}
        </View>

        {/* Tabela */}
        <View
          style={{
            borderWidth: 1,
            borderColor: "#e5e7eb",
            borderRadius: 4,
            overflow: "hidden",
            backgroundColor: "#fff",
            marginBottom: 20,
            flex: 1,
          }}
        >
          {/* Cabeçalho da tabela */}
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#1e3a8a",
              height: 36,
              alignItems: "center",
              borderBottomWidth: 1,
              borderBottomColor: "#fff",
            }}
          >
            {columns.map((col) => (
              <P
                key={col.header}
                style={{
                  flex: col.flex || 1,
                  color: "#fff",
                  fontWeight: "bold",
                  textAlign: "center",
                  borderRightWidth: 1,
                  borderRightColor: "#fff",
                }}
              >
                {col.header}
              </P>
            ))}
          </View>
          {/* Corpo da tabela */}
          {isLoading ? (
            <View style={{ padding: 20, alignItems: "center" }}>
              <ActivityIndicator size="large" color="#1e3a8a" />
            </View>
          ) : data && data.length > 0 ? (
            data.map((item, idx) => (
              <View
                key={idx}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  minHeight: 50,
                  paddingVertical: 4,
                }}
              >
                {columns.map((col) => (
                  <View
                    key={col.accessor}
                    style={{
                      flex: col.flex || 1,
                      justifyContent: "center",
                      alignItems: "center",
                      paddingHorizontal: 4,
                      borderRightWidth: 1,
                      borderRightColor: "#e5e7eb",
                      alignSelf: "stretch",
                    }}
                  >
                    {col.render ? (
                      col.render(item)
                    ) : (
                      <P style={{ textAlign: "center", color: "#222" }}>
                        {item[col.accessor]}
                      </P>
                    )}
                  </View>
                ))}
              </View>
            ))
          ) : (
            <View
              style={{
                height: 50,
                alignItems: "center",
                justifyContent: "center",
                marginTop: 8,
              }}
            >
              <P style={{ color: "#222", fontSize: 15 }}>{noDataMessage}</P>
            </View>
          )}
        </View>

        {/* Botão VOLTAR */}
        <View style={{ alignItems: "flex-end" }}>
          <BackButton
            style={{
              backgroundColor: "#1e3a8a",
              borderRadius: 4,
              width: 110,
              height: 36,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={onClose}
          >
            <P style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
              VOLTAR
            </P>
          </BackButton>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}
