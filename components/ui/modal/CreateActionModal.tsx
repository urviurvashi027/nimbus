import React, { useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Pressable,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import ThemeContext from "@/contexts/ThemeContext";

interface CreateActionModalProps {
  visible: boolean;
  onClose: () => void;
}

const CreateActionModal: React.FC<CreateActionModalProps> = ({
  visible,
  onClose,
}) => {
  const { newTheme, spacing, typography } = React.useContext(ThemeContext);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 350,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 20,
          duration: 250,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [fadeAnim, slideAnim, visible]);

  const handleAction = (route: any) => {
    onClose();
    // Use a small timeout to allow modal to close before navigating
    setTimeout(() => {
      router.push(route);
    }, 100);
  };

  const styles = styling(newTheme, spacing, typography);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]} />
      </TouchableWithoutFeedback>

      <View style={styles.centeredView} pointerEvents="box-none">
        <Animated.View
          style={[
            styles.modalView,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.header}>
            <Text style={styles.title}>What would you like to create?</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={newTheme.textSecondary} />
            </Pressable>
          </View>

          <View style={styles.optionsContainer}>
            <ActionOption
              icon="sparkles-outline"
              title="Custom Ritual"
              description="Design a personal habit from scratch"
              onPress={() => handleAction("/(auth)/habit/CreateHabitScreen")}
              theme={newTheme}
              spacing={spacing}
              typography={typography}
            />

            <ActionOption
              icon="library-outline"
              title="Import from Library"
              description="Choose from our curated routine templates"
              onPress={() => handleAction("/(auth)/toolsScreen/RoutineScreen")}
              theme={newTheme}
              spacing={spacing}
              typography={typography}
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

interface ActionOptionProps {
  icon: any;
  title: string;
  description: string;
  onPress: () => void;
  theme: any;
  spacing: any;
  typography: any;
}

const ActionOption: React.FC<ActionOptionProps> = ({
  icon,
  title,
  description,
  onPress,
  theme,
  spacing,
  typography,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          padding: spacing.md,
          flexDirection: "row",
          alignItems: "center",
          borderRadius: 20,
          backgroundColor: pressed
            ? "rgba(255,255,255,0.06)"
            : "rgba(255,255,255,0.02)",
          borderWidth: 1,
          borderColor: pressed
            ? "rgba(255,255,255,0.1)"
            : "rgba(255,255,255,0.05)",
        },
      ]}
    >
      <View
        style={{
          width: 52,
          height: 52,
          borderRadius: 16,
          backgroundColor: "rgba(163, 190, 140, 0.15)",
          justifyContent: "center",
          alignItems: "center",
          marginRight: spacing.md,
        }}
      >
        <Ionicons name={icon} size={26} color={theme.accent} />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            ...typography.body,
            fontSize: 17,
            fontWeight: "700",
            color: theme.textPrimary,
            marginBottom: 4,
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            ...typography.caption,
            fontSize: 13,
            color: theme.textSecondary,
            lineHeight: 18,
          }}
        >
          {description}
        </Text>
      </View>
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: "rgba(255,255,255,0.05)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Ionicons name="chevron-forward" size={18} color={theme.accent} />
      </View>
    </Pressable>
  );
};

const styling = (theme: any, spacing: any, typography: any) =>
  StyleSheet.create({
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0, 0, 0, 0.7)",
    },
    centeredView: {
      flex: 1,
      justifyContent: "flex-end",
      alignItems: "center",
      paddingHorizontal: spacing.md,
      paddingBottom: 120, // Clear the bottom tab bar
    },
    modalView: {
      width: "100%",
      backgroundColor: theme.surface,
      borderRadius: 32,
      padding: spacing.lg,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: -10,
      },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 20,
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.08)",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing.md,
      paddingLeft: spacing.xs,
    },
    title: {
      ...typography.h3,
      color: theme.textPrimary,
    },
    closeButton: {
      padding: spacing.xs,
    },
    optionsContainer: {
      gap: spacing.md,
    },
  });

export default CreateActionModal;
