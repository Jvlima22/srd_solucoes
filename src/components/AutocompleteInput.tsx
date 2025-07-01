import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import { getUnidades } from "../service/services";

interface AutocompleteInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSelectUnidade: (unidade: Unidade) => void;
  placeholder?: string;
  selectedUnidade: Unidade | null;
}

export const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  value,
  onChangeText,
  onSelectUnidade,
  placeholder = "Digite para buscar...",
  selectedUnidade,
}) => {
  const [suggestions, setSuggestions] = useState<Unidade[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const searchUnidades = async (term: string) => {
    if (!term.trim()) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await getUnidades(term.trim());

      if (response.data && response.data.unidades) {
        setSuggestions(response.data.unidades);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Erro ao buscar unidades:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextChange = (text: string) => {
    setSearchTerm(text);
    onChangeText(text);

    // Limpar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounce de 300ms para evitar muitas requisições
    timeoutRef.current = setTimeout(() => {
      searchUnidades(text);
    }, 300);
  };

  const handleSelectUnidade = (unidade: Unidade) => {
    onSelectUnidade(unidade);
    setSearchTerm(unidade.nome);
    onChangeText(unidade.nome);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleFocus = () => {
    if (searchTerm.trim() && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    // Delay para permitir que o clique no item funcione
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  const toggleSuggestions = () => {
    if (searchTerm.trim()) {
      setShowSuggestions(!showSuggestions);
      if (!showSuggestions && suggestions.length === 0) {
        searchUnidades(searchTerm);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <View className="relative">
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
            style={{ paddingRight: 50 }}
            value={searchTerm}
            onChangeText={handleTextChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            placeholderTextColor="#666"
          />
          <TouchableOpacity
            onPress={toggleSuggestions}
            style={{ position: "absolute", right: 16 }}
            hitSlop={10}
          >
            {showSuggestions ? (
              <ChevronUp size={20} color="#666" />
            ) : (
              <ChevronDown size={20} color="#666" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Lista de sugestões */}
      {showSuggestions && (
        <View
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 4,
          }}
          className="absolute left-0 right-0 top-16 z-50 max-h-48 rounded-xl bg-grayscale-0"
        >
          {isLoading ? (
            <View className="p-4">
              <Text className="text-center text-gray-500">Carregando...</Text>
            </View>
          ) : suggestions.length > 0 ? (
            <FlatList
              data={suggestions}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelectUnidade(item)}
                  className="border-b border-gray-200 p-4"
                  activeOpacity={0.7}
                >
                  <Text className="text-base font-medium text-gray-800">
                    {item.nome}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    {item.identificador}
                  </Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          ) : searchTerm.trim() ? (
            <View className="p-4">
              <Text className="text-center text-gray-500">
                Nenhuma unidade encontrada
              </Text>
            </View>
          ) : null}
        </View>
      )}
    </View>
  );
};
