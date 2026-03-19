import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import ThemeContext from "@/contexts/ThemeContext";

type Props = {
  onSelect: (data: any, details: any) => void;
  placeholder?: string;
  initialValue?: string;
};

// Use EXPO_PUBLIC_ prefix for Expo environment variables
const GOOGLE_PLACES_API_KEY =
  process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY || "";

export default function LocationSearch({
  onSelect,
  placeholder = "Search location...",
  initialValue,
}: Props) {
  const { newTheme } = useContext(ThemeContext);

  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder={placeholder}
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          onSelect(data, details);
        }}
        query={{
          key: GOOGLE_PLACES_API_KEY,
          language: "en",
        }}
        textInputProps={{
          placeholderTextColor: newTheme.textSecondary,
          defaultValue: initialValue,
        }}
        styles={{
          container: {
            flex: 0,
            zIndex: 100,
          },
          textInputContainer: {
            backgroundColor: newTheme.surface,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: newTheme.border,
            paddingHorizontal: 5,
          },
          textInput: {
            height: 50,
            color: newTheme.textPrimary,
            fontSize: 16,
            backgroundColor: "transparent",
          },
          listView: {
            backgroundColor: newTheme.surface,
            marginTop: 5,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: newTheme.border,
            zIndex: 1000,
            position: "absolute",
            top: 55,
            width: "100%",
          },
          row: {
            backgroundColor: "transparent",
            padding: 13,
            flexDirection: "row",
          },
          description: {
            color: newTheme.textPrimary,
          },
          separator: {
            height: 0.5,
            backgroundColor: newTheme.border,
          },
        }}
        enablePoweredByContainer={false}
        fetchDetails={true}
        nearbyPlacesAPI="GooglePlacesSearch"
        debounce={300}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 10,
    zIndex: 100,
  },
});
