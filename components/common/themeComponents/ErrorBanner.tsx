import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemeContext from "@/context/ThemeContext";

type ErrorBannerProps = {
  message?: string | null;
  visible?: boolean;
  onDismiss?: () => void;
  style?: StyleProp<ViewStyle>;
};

const ErrorBanner: React.FC<ErrorBannerProps> = ({
  message,
  visible = true,
  onDismiss,
  style,
}) => {
  const { newTheme } = useContext(ThemeContext);
  const styles = getStyles(newTheme);

  if (!visible || !message) return null;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.contentRow}>
        <View style={styles.iconWrap}>
          <Ionicons
            name="alert-circle"
            size={18}
            color={newTheme.error ?? "#FF6B6B"}
          />
        </View>

        <Text style={styles.message} numberOfLines={3}>
          {message}
        </Text>

        {onDismiss && (
          <TouchableOpacity
            onPress={onDismiss}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.closeBtn}
          >
            <Ionicons name="close" size={16} color={newTheme.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default ErrorBanner;

const getStyles = (t: any) =>
  StyleSheet.create({
    container: {
      borderRadius: 14,
      paddingHorizontal: 12,
      paddingVertical: 10,
      backgroundColor: t.errorSoft ?? "rgba(255, 107, 107, 0.09)", // soft error bg
      borderWidth: 1,
      borderColor: t.error ?? "#FF6B6B",
      marginBottom: 14,
    },
    contentRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    iconWrap: {
      width: 24,
      height: 24,
      borderRadius: 999,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 8,
      backgroundColor: t.errorSoftStrong ?? "rgba(255, 107, 107, 0.18)", // slightly stronger circle
    },
    message: {
      flex: 1,
      color: t.textPrimary,
      fontSize: 13,
      lineHeight: 19,
      fontWeight: "500",
    },
    closeBtn: {
      marginLeft: 6,
      padding: 4,
    },
  });
